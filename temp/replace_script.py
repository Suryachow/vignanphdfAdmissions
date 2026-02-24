import re

file_path = r'v:\phd admissions\vignanphdfAdmissions\src\pages\Landing.tsx'
new_tabs_path = r'v:\phd admissions\vignanphdfAdmissions\temp\new_tabs.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

with open(new_tabs_path, 'r', encoding='utf-8') as f:
    new_tabs = f.read()

# Replace AnimatePresence content
start_tag = '<AnimatePresence mode="wait">'
end_tag = '</AnimatePresence>'

start_idx = content.find(start_tag)
end_idx = content.find(end_tag, start_idx)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx + len(start_tag)] + '\n' + new_tabs + '\n                            ' + content[end_idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Successfully replaced AnimatePresence block.')
else:
    print('Tags not found.')
