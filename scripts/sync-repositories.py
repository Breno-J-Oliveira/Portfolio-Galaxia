"""Refresh the public GitHub catalogue in projects.html; never requires a token.

Run from any directory: python scripts/sync-repositories.py
The page stays usable without JavaScript or a live GitHub API connection.
"""
from datetime import datetime, timezone
from html import escape
from pathlib import Path
import json
import re
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
OWNER = 'Breno-J-Oliveira'


def replace_between(source, name, content):
    start, end = f'<!-- {name}:start -->', f'<!-- {name}:end -->'
    if source.count(start) != 1 or source.count(end) != 1:
        raise ValueError(f'Missing or duplicate catalogue marker: {name}')
    before, rest = source.split(start, 1)
    _, after = rest.split(end, 1)
    return before + start + '\n' + content + '\n' + end + after


def main():
    repos = []
    for page in range(1, 101):
        url = f'https://api.github.com/users/{OWNER}/repos?per_page=100&page={page}&sort=updated'
        request = urllib.request.Request(url, headers={'User-Agent': 'Portfolio-Galaxia-catalogue', 'Accept': 'application/vnd.github+json'})
        with urllib.request.urlopen(request, timeout=30) as response:
            batch = json.load(response)
        if not isinstance(batch, list):
            raise ValueError('GitHub did not return a repository list')
        repos.extend(batch)
        if len(batch) < 100:
            break
    else:
        raise ValueError('Pagination was not completed; catalogue unchanged')
    if not repos:
        raise ValueError('Empty response; existing catalogue preserved')
    overrides = json.loads((ROOT / 'src/app/data/repository-descriptions.json').read_text(encoding='utf8'))
    rows = []
    for repo in sorted(repos, key=lambda r: r['name'].casefold()):
        if repo.get('private') or not repo['html_url'].startswith(f'https://github.com/{OWNER}/'):
            raise ValueError('Unexpected private or foreign repository; catalogue unchanged')
        name, url = escape(repo['name'], quote=True), escape(repo['html_url'], quote=True)
        language = escape(repo['language'] or 'Outros', quote=True)
        description = overrides.get(repo['name'], repo.get('description') or '')
        if '\ufffd' in description:
            description = ''
        fork = repo['fork']
        rows.append(
            f'<article class="repo-item" data-repo-name="{name}" data-language="{language}" '
            f'data-kind="{"fork" if fork else "original"}" data-updated="{escape(repo["updated_at"], quote=True)}">'
            f'<div class="repo-item-top"><h3><a href="{url}" target="_blank" rel="noopener noreferrer">'
            f'{name} <span aria-hidden="true">↗</span></a></h3>'
            + ('<span class="repo-fork">Fork</span>' if fork else '') + '</div>'
            + (f'<p>{escape(description)}</p>' if description else '')
            + f'<div class="repo-meta"><span>{language}</span><a href="{url}" target="_blank" '
            f'rel="noopener noreferrer" aria-label="Abrir {name} no GitHub">Abrir no GitHub</a></div></article>'
        )
    page = ROOT / 'projects.html'
    source = page.read_text(encoding='utf8')
    source = replace_between(source, 'repository-items', '\n'.join(rows))
    options = ''.join(f'<option>{escape(lang)}</option>' for lang in sorted({r['language'] or 'Outros' for r in repos}))
    source = replace_between(source, 'repository-languages', options)
    source = re.sub(r'(<span data-repo-total>)\d+(</span>)', lambda m: m[1] + str(len(repos)) + m[2], source)
    source = re.sub(r'(<p id="repo-count" role="status">).*?(</p>)', lambda m: m[1] + f'{len(repos)} repositórios públicos.' + m[2], source)
    now = datetime.now(timezone.utc)
    source = re.sub(r'<time id="repo-updated".*?</time>', f'<time id="repo-updated" datetime="{now:%Y-%m-%d}">{now:%d/%m/%Y}</time>', source)
    page.write_text(source, encoding='utf8')
    print(f'Updated {len(repos)} public repositories. Review the diff, bump sw.js cache and deploy normally.')


if __name__ == '__main__':
    main()
