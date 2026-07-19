import os
import time

# --- Configuration ---
WORKSPACE_ROOT = "."
OUTPUT_FILE = "nexhire_ai_context.md"

# Extensions to include in the context bundle
TARGET_EXTENSIONS = ('.ts', '.tsx', '.json', '.yml', '.css', '.html')

# Directories and files to completely ignore
IGNORE_DIRS = {'node_modules', '.git', 'dist', 'build', 'public', 'assets'}
IGNORE_FILES = {'package-lock.json', 'eslint.config.js'}

def is_target_file(filepath, filename):
    if filename in IGNORE_FILES:
        return False
    return filepath.endswith(TARGET_EXTENSIONS)

def generate_context():
    print(f"🚀 Scanning NexHire Workspace...")
    
    total_files = 0
    total_loc = 0
    frontend_loc = 0
    backend_loc = 0
    
    file_contents = []
    tree_structure = []

    for root, dirs, files in os.walk(WORKSPACE_ROOT):
        # Mutate dirs in-place to skip ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        # Calculate depth for tree structure formatting
        level = root.replace(WORKSPACE_ROOT, '').count(os.sep)
        indent = ' ' * 4 * level
        folder_name = os.path.basename(root)
        
        if folder_name != '.':
            tree_structure.append(f"{indent}📂 {folder_name}/")
        
        subindent = ' ' * 4 * (level + 1)

        for filename in files:
            if is_target_file(filename, filename):
                filepath = os.path.join(root, filename)
                relative_path = os.path.relpath(filepath, WORKSPACE_ROOT)
                
                tree_structure.append(f"{subindent}📄 {filename}")
                
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        lines = content.count('\n') + 1
                        
                        total_files += 1
                        total_loc += lines
                        
                        # Track progress by module
                        if 'nexhire-client' in relative_path:
                            frontend_loc += lines
                        elif 'nexhire-api' in relative_path:
                            backend_loc += lines

                        # Determine markdown language tag
                        ext = filename.split('.')[-1]
                        lang = 'typescript' if ext in ['ts', 'tsx'] else ext
                        
                        file_contents.append(f"### File: `{relative_path}`\n```{lang}\n{content}\n```\n")
                except Exception as e:
                    print(f"⚠️ Could not read {filepath}: {e}")

    # --- Write to Output File ---
    print(f"📝 Compiling AI Context into {OUTPUT_FILE}...")
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as out_file:
        out_file.write("# 🚀 NexHire Workspace - AI Context Bundle\n\n")
        out_file.write(f"**Generated on:** {time.strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        out_file.write("## 📊 Project Progress Metrics\n")
        out_file.write(f"- **Total Source Files:** {total_files}\n")
        out_file.write(f"- **Total Lines of Code (LOC):** {total_loc}\n")
        out_file.write(f"- **Frontend (nexhire-client):** {frontend_loc} LOC\n")
        out_file.write(f"- **Backend (nexhire-api):** {backend_loc} LOC\n\n")
        
        out_file.write("## 🗂️ Directory Structure\n```text\nnexhire-workspace/\n")
        out_file.write('\n'.join(tree_structure))
        out_file.write("\n```\n\n")
        
        out_file.write("## 💻 Source Code\n\n")
        out_file.write('\n'.join(file_contents))

    print(f"✅ Success! Context generated.")
    print(f"📊 Progress: {total_files} files processed ({total_loc} Total Lines of Code).")
    print(f"   - Frontend: {frontend_loc} lines")
    print(f"   - Backend:  {backend_loc} lines")

if __name__ == "__main__":
    generate_context()