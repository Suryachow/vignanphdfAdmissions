import sys

file_path = r'v:\phd admissions\vignanphdfAdmissions\src\pages\Landing.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('\\`', '`')
text = text.replace('\\$', '$')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Unescaped JSX successfully!")
