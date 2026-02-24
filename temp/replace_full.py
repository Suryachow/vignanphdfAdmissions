import sys
import re

file_path = r'v:\phd admissions\vignanphdfAdmissions\src\pages\Landing.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_tag = '<div className="container mx-auto px-6 max-w-6xl relative z-10">'
end_tag = '</section>\n\n                {/* Statistics Footer Bar */}'

start_idx = content.find(start_tag)
end_idx = content.find(end_tag, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Cannot find markers")
    sys.exit(1)

# Read the TS file text
with open(r'v:\phd admissions\vignanphdfAdmissions\temp\new_layout_str.ts', 'r', encoding='utf-8') as f:
    ts_content = f.read()

val_start = ts_content.find('`') + 1
val_end = ts_content.rfind('`')
new_html = ts_content[val_start:val_end]

final_content = content[:start_idx] + new_html + '\n                ' + content[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(final_content)

print("success")
