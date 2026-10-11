#!/usr/bin/env python3
"""Best-effort route and starter UI-language migration for the Softmeal Next.js app.

Run in dry-run mode first, then pass --apply after reviewing the plan.
The route mappings and phrase dictionary are editable constants below.
"""
from __future__ import annotations

import argparse
import re
import shutil
import sys
from pathlib import Path

# Proposed Vietnamese -> English route mappings. Missing routes are skipped safely.
# Mapping order matters: the broad /cong-thuc tree is moved before the edit route.
ROUTE_MAP = [
    ("cong-thuc", "recipes"),
    ("goi-y", "meal-plans"),
    ("them", "recipes/new"),
    ("sua-cong-thuc/[slug]", "recipes/[slug]/edit"),
    ("dang-nhap", "login"),
    ("dang-ky", "register"),
    ("ho-so", "profile"),
    ("quan-tri", "admin"),
    ("huong-dan", "guide"),
    ("chinh-sach-bao-mat", "privacy-policy"),
]

# Starter translations for common UI labels. This is deliberately conservative;
# the report produced by this script lists remaining lines containing Vietnamese.
PHRASES = {
    "Chính sách bảo mật": "Privacy Policy",
    "Thời gian chuẩn bị": "Prep time",
    "Thời gian nấu": "Cook time",
    "Công thức nấu ăn": "Recipes",
    "Không có công thức nào": "No recipes found",
    "Thêm công thức": "Add a recipe",
    "Sửa công thức": "Edit recipe",
    "Lưu công thức": "Save recipe",
    "Xem chi tiết": "View details",
    "Đăng nhập": "Sign in",
    "Đăng ký": "Sign up",
    "Đăng xuất": "Sign out",
    "Nguyên liệu": "Ingredients",
    "Hướng dẫn": "Guide",
    "Cách làm": "Instructions",
    "Khẩu phần": "Servings",
    "Trang chủ": "Home",
    "Công thức": "Recipes",
    "Tìm kiếm": "Search",
    "Xem thêm": "See more",
    "Đang tải...": "Loading...",
    "Không tìm thấy": "Not found",
    "Trở về": "Go back",
    "Hồ sơ": "Profile",
    "Quản trị": "Admin",
    "Chia sẻ": "Share",
    "Hủy": "Cancel",
    "Lưu": "Save",
    "Xóa": "Delete",
    "Sửa": "Edit",
    "Gửi": "Send",
}

TEXT_EXTENSIONS = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".md", ".mdx", ".html", ".htm"
}
SKIP_DIRS = {
    ".git", "node_modules", ".next", "dist", "build", "coverage", ".turbo", ".vercel"
}
VIETNAMESE_RE = re.compile(r"[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸàáâãèéêìíòóôõùúăđĩũơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]")


def log(message: str) -> None:
    print(message)


def find_route_roots(project: Path) -> list[Path]:
    roots = [project / "app", project / "src" / "app"]
    return [p for p in roots if p.is_dir()]


def route_page_files(route_dir: Path) -> list[Path]:
    return [p for p in route_dir.rglob("page.*") if p.is_file() and p.suffix in {".tsx", ".ts", ".jsx", ".js", ".mdx"}]


def route_url_from_dir(route_root: Path, route_dir: Path) -> str:
    rel = route_dir.relative_to(route_root).as_posix()
    return "/" + ("" if rel == "." else rel)


def url_expr(route: str) -> str:
    """Create a JS URL expression from a Next.js route pattern."""
    parts = [p for p in route.strip("/").split("/") if p]
    pieces = []
    for part in parts:
        m = re.fullmatch(r"\[\[\.\.\.(\w+)\]\]", part)
        if m:
            key = m.group(1)
            pieces.append(f'(routeParams[{key!r} ] ? "/" + routeParams[{key!r}].map((v: string) => encodeURIComponent(v)).join("/") : "")')
            continue
        m = re.fullmatch(r"\[\.\.\.(\w+)\]", part)
        if m:
            key = m.group(1)
            pieces.append(f'routeParams[{key!r}].map((v: string) => encodeURIComponent(v)).join("/")')
            continue
        m = re.fullmatch(r"\[(\w+)\]", part)
        if m:
            key = m.group(1)
            pieces.append(f'encodeURIComponent(String(routeParams[{key!r}]))')
            continue
        pieces.append(repr(part))
    if not pieces:
        return '"/"'
    expression = ' + "/" + '.join(pieces)
    return '"/" + ' + expression


def redirect_page(route_target: str) -> str:
    expression = url_expr(route_target)
    if "routeParams[" in expression:
        return (
            'import { redirect } from "next/navigation";\n\n'
            'export default async function LegacyRoute({ params }: { params: any }) {\n'
            '  const routeParams = await params;\n'
            f'  redirect({expression});\n'
            '}\n'
        )
    return (
        'import { redirect } from "next/navigation";\n\n'
        'export default function LegacyRoute() {\n'
        f'  redirect({expression});\n'
        '}\n'
    )


def is_ignored(path: Path, project: Path) -> bool:
    try:
        parts = path.relative_to(project).parts
    except ValueError:
        return True
    return any(part in SKIP_DIRS for part in parts)


def collect_text_files(project: Path) -> list[Path]:
    files = []
    for p in project.rglob("*"):
        if not p.is_file() or is_ignored(p, project):
            continue
        if p.suffix.lower() in TEXT_EXTENSIONS:
            files.append(p)
    return files


def update_route_references(text: str) -> str:
    # Edit routes are handled before the shorter /cong-thuc prefix to avoid partial matches.
    # Handles literal URLs as well as template strings such as `/sua-cong-thuc/${slug}`.
    text = re.sub(
        r"/sua-cong-thuc/(\$\{[^}]+\}|[^\s\"'`?#){}]+)",
        lambda m: "/recipes/" + m.group(1) + "/edit",
        text,
    )
    replacements = [
        (r"/cong-thuc(?=/|[?#\"'`]|\s|$)", "/recipes"),
        (r"/goi-y(?=/|[?#\"'`]|\s|$)", "/meal-plans"),
        (r"/them(?=/|[?#\"'`]|\s|$)", "/recipes/new"),
        (r"/dang-nhap(?=/|[?#\"'`]|\s|$)", "/login"),
        (r"/dang-ky(?=/|[?#\"'`]|\s|$)", "/register"),
        (r"/ho-so(?=/|[?#\"'`]|\s|$)", "/profile"),
        (r"/quan-tri(?=/|[?#\"'`]|\s|$)", "/admin"),
        (r"/huong-dan(?=/|[?#\"'`]|\s|$)", "/guide"),
        (r"/chinh-sach-bao-mat(?=/|[?#\"'`]|\s|$)", "/privacy-policy"),
    ]
    for pattern, replacement in replacements:
        text = re.sub(pattern, replacement, text)
    return text


def translate_starter_phrases(text: str) -> str:
    for vi in sorted(PHRASES, key=len, reverse=True):
        text = text.replace(vi, PHRASES[vi])
    return text


def update_html_lang(text: str) -> str:
    # Normalize an existing lang attribute on <html> or add one if missing.
    m = re.search(r"<html\b[^>]*>", text, flags=re.IGNORECASE)
    if not m:
        return text
    tag = m.group(0)
    if re.search(r"\blang\s*=", tag, flags=re.IGNORECASE):
        tag2 = re.sub(r"(\blang\s*=\s*)(['\"])[^'\"]*\2", r"\1\2en\2", tag, count=1, flags=re.IGNORECASE)
    else:
        tag2 = tag[:-1] + ' lang="en">'
    return text[:m.start()] + tag2 + text[m.end():]


def merge_move(source: Path, target: Path, apply: bool) -> None:
    """Move a route tree into target, merging directories but never overwriting files."""
    if not apply:
        return
    target.mkdir(parents=True, exist_ok=True)
    for src in sorted(source.rglob("*"), key=lambda p: len(p.parts)):
        if src.is_dir():
            continue
        rel = src.relative_to(source)
        dst = target / rel
        if dst.exists():
            raise FileExistsError(f"Refusing to overwrite existing file: {dst}")
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dst))
    shutil.rmtree(source)


def plan_route_moves(project: Path, apply: bool) -> list[tuple[str, str, str]]:
    moves = []
    roots = find_route_roots(project)
    if not roots:
        raise FileNotFoundError("Could not find app/ or src/app/ Next.js route directory")

    for root in roots:
        for old_rel, new_rel in ROUTE_MAP:
            src = root / old_rel
            if not src.is_dir():
                continue
            dst = root / new_rel
            pages = route_page_files(src)
            old_route_prefix = "/" + old_rel.strip("/")
            new_route_prefix = "/" + new_rel.strip("/")
            for page_file in pages:
                old_dir = page_file.parent
                rel_dir = old_dir.relative_to(src)
                old_url = old_route_prefix + (("/" + rel_dir.as_posix()) if str(rel_dir) != "." else "")
                target_url = new_route_prefix + (("/" + rel_dir.as_posix()) if str(rel_dir) != "." else "")
                moves.append((str(root), old_url, target_url))
            log(f"ROUTE {'MOVE' if apply else 'PLAN'}: {src.relative_to(project)} -> {dst.relative_to(project)}")
            if apply:
                # Preflight file collisions before mutating this route.
                conflicts = []
                if dst.exists():
                    for item in src.rglob("*"):
                        if item.is_file():
                            candidate = dst / item.relative_to(src)
                            if candidate.exists():
                                conflicts.append(candidate)
                if conflicts:
                    raise FileExistsError("Route move would overwrite files:\n" + "\n".join(map(str, conflicts)))
                merge_move(src, dst, apply=True)
    return moves


def write_legacy_redirects(route_moves: list[tuple[str, str, str]], project: Path, apply: bool) -> None:
    # The destination routes have already been moved. Add simple page-level stubs for old URLs.
    seen = set()
    for root_str, old_url, new_url in route_moves:
        key = (root_str, old_url)
        if key in seen:
            continue
        seen.add(key)
        root = Path(root_str)
        route_dir = root / old_url.strip("/")
        page_path = route_dir / "page.tsx"
        log(f"REDIRECT {'WRITE' if apply else 'PLAN'}: {old_url} -> {new_url}")
        if apply:
            page_path.parent.mkdir(parents=True, exist_ok=True)
            if page_path.exists():
                raise FileExistsError(f"Refusing to overwrite legacy route page: {page_path}")
            page_path.write_text(redirect_page(new_url), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("project", nargs="?", default=".", help="Path to the local Softmeal checkout (default: current directory)")
    parser.add_argument("--apply", action="store_true", help="Apply changes. Without this flag, only print the plan.")
    args = parser.parse_args()
    project = Path(args.project).resolve()
    if not (project / "package.json").is_file():
        print(f"ERROR: {project} does not contain package.json", file=sys.stderr)
        return 2
    if not args.apply:
        log("DRY RUN ONLY — no files will be changed. Review the mappings in this script first.")
    else:
        log("APPLY MODE — make sure your working tree is committed or backed up.")

    route_moves = plan_route_moves(project, args.apply)

    text_files = collect_text_files(project)
    changed = 0
    for path in text_files:
        original = path.read_text(encoding="utf-8", errors="replace")
        updated = update_html_lang(original)
        updated = update_route_references(updated)
        updated = translate_starter_phrases(updated)
        if updated != original:
            changed += 1
            log(f"TEXT {'UPDATE' if args.apply else 'PLAN'}: {path.relative_to(project)}")
            if args.apply:
                path.write_text(updated, encoding="utf-8")

    write_legacy_redirects(route_moves, project, args.apply)

    # List remaining files/lines containing Vietnamese characters after replacements.
    residuals: list[str] = []
    for path in collect_text_files(project):
        content = path.read_text(encoding="utf-8", errors="replace")
        for lineno, line in enumerate(content.splitlines(), 1):
            if VIETNAMESE_RE.search(line):
                residuals.append(f"{path.relative_to(project)}:{lineno}: {line.strip()[:240]}")
    report_path = project / "ENGLISH_MIGRATION_REVIEW.md"
    report = [
        "# English migration review", "",
        "This is an automated starter migration, not a complete human translation.",
        "Review every listed line and translate any remaining Vietnamese copy, metadata, category labels, errors, and email/notification text.", "",
        f"Potential Vietnamese lines found: **{len(residuals)}**", "",
    ]
    report.extend(f"- `{item}`" for item in residuals[:500])
    if len(residuals) > 500:
        report += ["", f"Only the first 500 of {len(residuals)} lines are listed."]
    if not residuals:
        report.append("No lines with common Vietnamese diacritics were detected, but still review content without diacritics and dynamically generated strings.")
    if args.apply:
        report_path.write_text("\n".join(report) + "\n", encoding="utf-8")
        log(f"REPORT: {report_path.relative_to(project)}")
    else:
        log(f"TEXT FILES THAT WOULD CHANGE: {changed}")
        log("Run again with --apply to make the changes and generate ENGLISH_MIGRATION_REVIEW.md.")
    log("NOTE: route mappings are proposed defaults. Confirm they match the repository before applying.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
