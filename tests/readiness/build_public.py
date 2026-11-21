"""Build only public website assets; repository working files never enter the deploy."""
from pathlib import Path
import shutil
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'public-site'
EXTENSIONS = {'.html','.css','.js','.svg','.png','.jpg','.jpeg','.ico','.mp4','.vtt','.pdf','.json'}
def public_files():
    files = [p for p in ROOT.iterdir() if p.is_file() and p.suffix in {'.html','.css','.js','.ico'}]
    files += [ROOT/'robots.txt', ROOT/'sitemap.xml', ROOT/'.well-known/security.txt']
    for directory in ['assets','business']:
        files += [p for p in (ROOT/directory).rglob('*') if p.is_file() and p.suffix.lower() in EXTENSIONS and not any(x.startswith('.') for x in p.relative_to(ROOT).parts)]
    return sorted(files)
def build():
    assert OUT.resolve().parent == ROOT.resolve() and OUT.name == 'public-site'
    if OUT.exists():
        assert not OUT.is_symlink()
        shutil.rmtree(OUT)
    for source in public_files():
        assert not source.is_symlink()
        target = OUT/source.relative_to(ROOT)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
    print(f'Built {len(public_files())} public files in {OUT}')
if __name__ == '__main__':
    build()
