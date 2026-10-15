"""Gera variantes responsivas das fotos (WebP).

Rodar (na raiz do projeto):  python tools/otimizar-imagens.py
Convenção: para cada fonte X.webp, grava na mesma pasta X-480.webp, X-800.webp
e X-1280.webp (largura em px, altura proporcional; sem ampliar a fonte).
Idempotente: sobrescreve só as variantes, nunca o original.
Se uma variante passar da meta de KB, baixa a qualidade de 5 em 5 até 60.
"""
import io
import os
from PIL import Image, ImageOps

FONTES = [
    "Fotos/LandingPKZ.webp",
    "Fotos/LandingOneToOne.webp",
    "PKZ/Fotos/EquipePKZ.webp",
    "PKZ/Fotos/karate.webp",
    "PKZ/Fotos/JiuJitsu.webp",
    "PKZ/Fotos/volei.webp",
    "OneToOne/Fotos/equipe.webp",
    "OneToOne/Fotos/fisioterapia.webp",
    "OneToOne/Fotos/nutricao.webp",
    "OneToOne/Fotos/personal-training.webp",
]
ALVOS = {480: 60, 800: 130, 1280: 250}  # largura -> meta em KB
QUALIDADE, QUALIDADE_MIN = 72, 60

raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print(f"{'fonte':42} {'orig':>11} {'KB':>7}  variante -> dimensões, KB, qualidade")
for fonte in FONTES:
    caminho = os.path.join(raiz, fonte)
    img = ImageOps.exif_transpose(Image.open(caminho))
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")
    kb_orig = os.path.getsize(caminho) / 1024
    print(f"{fonte:42} {img.width}x{img.height:<5} {kb_orig:7.0f}")
    base = os.path.splitext(caminho)[0]
    for largura, meta in ALVOS.items():
        v = img.copy()
        if v.width > largura:
            v = v.resize((largura, round(v.height * largura / v.width)), Image.LANCZOS)
        q = QUALIDADE
        while True:
            buf = io.BytesIO()
            v.save(buf, "WEBP", quality=q, method=6)
            kb = buf.tell() / 1024
            if kb <= meta or q <= QUALIDADE_MIN:
                break
            q -= 5
        with open(f"{base}-{largura}.webp", "wb") as f:
            f.write(buf.getvalue())
        aviso = "" if kb <= meta else "  ACIMA DA META"
        print(f"    -{largura}.webp -> {v.width}x{v.height}, {kb:6.1f} KB, q={q}{aviso}")
