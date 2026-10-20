#!/usr/bin/env python3
"""Dependency-free, enforceable SEO regressions for the latest Rehabwheel release.

The 1,000-checkpoint matrix is a BACKLOG. This automated guard proves only its
explicit programmatic assertions; it does not claim the 1,000 tasks are complete.
"""
import re
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://rehabwheel.com"

class Page(HTMLParser):
    def __init__(self, src):
        self.meta = {}
        self.canonicals = []
        self.images = []
        self.h1 = 0
        self.titles = []
        self.scripts = []
        self.mode = None
        self.buf = ""
        super().__init__(convert_charrefs=True)
        self.feed(src)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs.get("href", ""))
        if tag == "meta":
            key = attrs.get("name") or attrs.get("property")
            if key: self.meta.setdefault(key, []).append(attrs.get("content", ""))
        if tag == "img": self.images.append(attrs)
        if tag == "h1": self.h1 += 1
        if tag == "title": self.mode, self.buf = "title", ""
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.mode, self.buf = "schema", ""
    def handle_data(self, data):
        if self.mode: self.buf += data
    def handle_endtag(self, tag):
        if tag == "title" and self.mode == "title":
            self.titles.append(self.buf.strip()); self.mode = None
        if tag == "script" and self.mode == "schema":
            self.scripts.append(json.loads(self.buf)); self.mode = None

def verify(condition, message):
    if not condition: raise AssertionError(message)

def file_for(url):
    path = urlsplit(url).path
    if path.endswith("/"): path += "index.html"
    return ROOT / path.lstrip("/")

ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
sitemap = ET.parse(ROOT / "sitemap.xml").getroot()
urls = [e.text for e in sitemap.findall("s:url/s:loc", ns)]
verify(len(urls) == 28 and len(urls) == len(set(urls)), "Sitemap inventory must have 28 unique pages")

for url in urls:
    target = file_for(url)
    verify(target.is_file(), "Sitemap target absent: " + url)
    p = Page(target.read_text(encoding="utf-8"))
    verify(p.canonicals == [url], "Canonical mismatch: " + url)
    verify(len(p.titles) == 1 and p.titles[0], "Invalid title: " + url)
    verify(len(p.meta.get("description", [])) == 1 and p.meta["description"][0], "Invalid description: " + url)
    verify(p.h1 == 1, "H1 count wrong: " + url)
    verify("noindex" not in ",".join(p.meta.get("robots", [])).lower(), "Sitemap includes noindex page: " + url)
    for img in p.images:
        verify("alt" in img, "Image missing alt on " + url)

home_src = (ROOT / "index.html").read_text(encoding="utf-8")
home = Page(home_src)
for key in ("og:image", "og:image:alt", "twitter:card", "twitter:image"):
    verify(len(home.meta.get(key, [])) == 1, "Homepage social meta duplicate: " + key)
hero = "/assets/photos/legmaker-seated-demonstration.webp"
verify('rel="preload" href="' + hero + '"' in home_src, "Preload does not match the actual hero photo")
verify('src="assets/photos/legmaker-seated-demonstration.webp"' in home_src, "Missing hero image")
verify("Join Community Waitlist" in home_src, "Homepage Community CTA does not point to waitlist")
verify("Available now as an interactive mobile-friendly web preview" not in home_src,
       "Retired Community preview copy is publicly visible")

community_src = (ROOT / "community/index.html").read_text(encoding="utf-8")
community = Page(community_src)
verify('id="communityWaitlist"' in community_src, "Community waitlist form missing")
verify('name="community_email_consent"' in community_src, "Explicit email consent missing")
verify("Interactive Product Preview" not in community_src, "Retired public app wording remains")
verify(len(community.meta.get("og:title", [])) == 1, "Community OG title missing")
verify(len(community.meta.get("description", [])) == 1, "Community meta description missing")

evidence_src = (ROOT / "evidence.html").read_text(encoding="utf-8")
evidence = Page(evidence_src)
verify(len(evidence.scripts) >= 1, "Evidence structured data missing")
verify(len(evidence.meta.get("og:title", [])) == 1, "Evidence Open Graph title missing")
verify(len(evidence.meta.get("twitter:title", [])) == 1, "Evidence social title missing")
for restricted in ("AURC/Shepherd", "Partner scope, safety review", "participant protections"):
    verify(restricted.lower() not in evidence_src.lower(),
           "Private research planning text was published")

matrix = (ROOT / "docs/SEO_1000_AUDIT_MATRIX.md").read_text(encoding="utf-8")
ids = re.findall(r"\| SEO-(\d{4}) \|", matrix)
verify(len(ids) == 1000 and ids == [str(i).zfill(4) for i in range(1, 1001)],
       "The 1,000-item audit matrix is incomplete or misnumbered")
verify("work backlog" in matrix.lower(), "The 1,000-item matrix must not be represented as completed work")
robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
verify("Sitemap: https://rehabwheel.com/sitemap.xml" in robots, "Robots sitemap reference missing")
print("PASS: 28 indexable sitemap pages, metadata/image guards, Community waitlist, private-data exclusion, and 1,000-item audit matrix.")
