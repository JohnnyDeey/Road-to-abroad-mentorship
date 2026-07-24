import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

old1 = '<button id="scroll-down" onclick="window.scrollTo({top:document.body.scrollHeight,behavior:\'smooth\'})">↓</button>'
ok1 = old1 in html
if ok1: html = html.replace(old1, '')

old2 = '<button id="mob-btn" onclick="toggleSb()">☰</button>'
ok2 = old2 in html
if ok2: html = html.replace(old2, '')

def shrink_width(m):
    block = m.group(0)
    def replace_val(w):
        val = int(w.group(1))
        return w.group(0).replace(w.group(1), str(round(val * 0.7)))
    block = re.sub(r'(?:max-width|width)\s*:\s*(\d+)px', replace_val, block)
    return block

html = re.sub(r'#screen-login\s*\{[^}]*\}', shrink_width, html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('arrow removed:', ok1)
print('burger removed:', ok2)
print('Done')
