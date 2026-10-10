"""Static site generator for verbind-tech.net.

Renders every template in English (site root) and Indonesian (/id/).
Usage:  python3 src/build.py        (requires: pip install jinja2 pillow)
"""
import json
import os
import sys

from jinja2 import Environment, FileSystemLoader
from markupsafe import Markup
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import data as D  # noqa: E402

LANGS = {"en": "", "id": "id/"}

PAGES = [
    ("home.html", "index.html", {"nav": "home"}),
    ("solutions.html", "solutions.html", {"nav": "solutions"}),
    ("services.html", "services.html", {"nav": "services"}),
    ("projects.html", "projects.html", {"nav": "projects"}),
    ("about.html", "about.html", {"nav": "company"}),
    ("contact.html", "contact.html", {"nav": "contact"}),
    ("catalogue.html", "catalogue.html", {"nav": "solutions"}),
] + [("industry.html", f"industries/{i['slug']}.html", {"nav": "industries", "ind": i}) for i in D.INDUSTRIES]

# 24px stroke icons (currentColor)
ICONS = {
    "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "arrow-up-right": '<path d="M7 17L17 7M8 7h9v9"/>',
    "chevron": '<path d="M6 9l6 6 6-6"/>',
    "menu": '<path d="M3 6h18M3 12h18M3 18h18"/>',
    "close": '<path d="M6 6l12 12M18 6L6 18"/>',
    "check": '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    "plus": '<path d="M12 5v14M5 12h14"/>',
    "whatsapp": '<path d="M20 12a8 8 0 0 1-11.8 7L4 20l1-4.1A8 8 0 1 1 20 12z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/>',
    "phone": '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    "pin": '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    "search": '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    "capsule": '<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-40 12 12)"/><path d="M9.6 9.1l4.8 5.8"/>',
    "leaf": '<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z"/><path d="M5 19l8-8"/>',
    "bottle": '<path d="M10 3h4v3l2 3v12H8V9l2-3z"/><path d="M8 13h8"/>',
    "flask": '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>',
    "gear": '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    "line": '<path d="M3 17h18M5 17V9h4v8M11 17V5h4v12M17 17v-5h3"/>',
    "robot": '<path d="M4 20h7M7 20v-5l5-4 3 3"/><circle cx="7" cy="15" r="1.5"/><path d="M15 14l3-3-2-2"/><path d="M18 11l2 1"/>',
    "box": '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
    "weld": '<path d="M4 20l7-7M9 11l4 4M13 7l4 4-3 3-4-4z"/><path d="M17 3v2M20 6h-2M19.5 4.5L18 6"/>',
    "wrench": '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    "install": '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 21h16"/>',
    "calendar": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 15l2.5 2.5L16 13"/>',
    "bolt": '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    "refresh": '<path d="M20 11a8 8 0 0 0-14.6-4.5M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5M20 20v-4h-4"/>',
    "parts": '<circle cx="12" cy="12" r="3.5"/><path d="M12 2l2 3h3l1 3 3 2-1 3 1 3-3 2-1 3h-3l-2 3-2-3H7l-1-3-3-2 1-3-1-3 3-2 1-3h3z"/>',
    "building": '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5M9 9h.01M12 9h.01M15 9h.01M9 12h.01M12 12h.01M15 12h.01"/>',
    "shield": '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    "users": '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17.5" cy="9" r="2.5"/><path d="M16 14.5a5 5 0 0 1 6 5"/>',
    "factory": '<path d="M3 21V10l6 4V10l6 4V5h6v16z"/><path d="M7 18h2M12 18h2M17 18h2"/>',
    "cube": '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "doc": '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
    "instagram": '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/>',
    "linkedin": '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
    "facebook": '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>',
}

_sizes = {}


def img_size(name):
    if name not in _sizes:
        with Image.open(os.path.join(ROOT, "assets/img", name + ".webp")) as im:
            _sizes[name] = im.size
    return _sizes[name]


def build():
    env = Environment(loader=FileSystemLoader(os.path.join(HERE, "templates")),
                      autoescape=True, trim_blocks=True, lstrip_blocks=True)
    env.tests["contains"] = lambda seq, item: item in seq
    products = json.load(open(os.path.join(HERE, "catalog.json"), encoding="utf-8"))
    written = []

    for lang, prefix in LANGS.items():
        other = "id" if lang == "en" else "en"

        def tr(value, _lang=lang):
            if isinstance(value, dict):
                value = value[_lang]
            return Markup(value)

        def _(en, id_, _lang=lang):
            return Markup(en if _lang == "en" else id_)

        for tpl, path, ctx in PAGES:
            out = prefix + path
            here = os.path.dirname(out) or "."

            def url(target, _here=here, _prefix=prefix):
                anchor = ""
                if "#" in target:
                    target, anchor = target.split("#", 1)
                    anchor = "#" + anchor
                if not target:
                    return anchor
                rel = os.path.relpath(_prefix + target, _here)
                return rel + anchor

            def asset(p, _here=here):
                return os.path.relpath("assets/" + p, _here)

            def img(name, alt="", cls="", loading="lazy", sizes=None, _here=here):
                w, h = img_size(name)
                src = os.path.relpath(f"assets/img/{name}.webp", _here)
                attrs = f'src="{src}" alt="{Markup.escape(alt)}" width="{w}" height="{h}"'
                if cls:
                    attrs += f' class="{cls}"'
                if loading:
                    attrs += f' loading="{loading}" decoding="async"'
                return Markup(f"<img {attrs}>")

            def icon(name, cls="i"):
                return Markup(f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true">{ICONS[name]}</svg>')

            alt_href = os.path.relpath(LANGS[other] + path, here)
            html = env.get_template(tpl).render(
                lang=lang, other=other, _=_, t=tr, url=url, asset=asset, img=img, icon=icon,
                path=path, alt_href=alt_href, D=D, products=products, **ctx)
            dest = os.path.join(ROOT, out)
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            with open(dest, "w", encoding="utf-8") as f:
                f.write(html)
            written.append(out)
    print(f"built {len(written)} pages")


if __name__ == "__main__":
    build()
