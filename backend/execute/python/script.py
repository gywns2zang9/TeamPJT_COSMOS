import sys
import os

def main(run_file):
    try:
        if os.path.exists(run_file):
            with open(run_file, 'r') as file:
                exec(file.read())
        else:
            print(f"File not found: {run_file}")
    except Exception as e:
        print("Execution failed:", e)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <input_file>")
        sys.exit(1)

    run_file = sys.argv[1]
    main(run_file)
