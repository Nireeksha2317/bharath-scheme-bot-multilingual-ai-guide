import re

# Read the scheme data
with open('new_schemes_data.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Split into individual schemes
schemes = []
current_scheme = {}
lines = content.strip().split('\n')

for line in lines:
    line = line.strip()
    if not line or line.startswith('###'):
        if current_scheme:
            schemes.append(current_scheme)
            current_scheme = {}
        continue
    
    if line.startswith('- name:'):
        if current_scheme:
            schemes.append(current_scheme)
        current_scheme = {'name': line.split(':', 1)[1].strip().strip('"')}
    elif ':' in line and current_scheme:
        key, value = line.split(':', 1)
        key = key.strip().lstrip('- ')
        value = value.strip().strip('"')
        
        # Handle arrays (keywords, documents)
        if value.startswith('['):
            # Parse array
            value = value.strip('[]')
            current_scheme[key] = [item.strip().strip('"') for item in value.split(',')]
        else:
            current_scheme[key] = value

if current_scheme:
    schemes.append(current_scheme)

# Generate TypeScript code
ts_code = []
for scheme in schemes:
    ts_code.append('  {')
    for key, value in scheme.items():
        if isinstance(value, list):
            # Format array
            formatted_items = ', '.join([f'"{item}"' for item in value])
            ts_code.append(f'    {key}: [{formatted_items}],')
        else:
            # Escape quotes in strings
            escaped_value = value.replace('"', '\\"')
            ts_code.append(f'    {key}: "{escaped_value}",')
    ts_code.append('  },')

# Write output
with open('schemes_ts_output.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(ts_code))

print(f"Converted {len(schemes)} schemes successfully!")
