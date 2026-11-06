# Introduction

## What is Git and GitHub?

Git is a distributed version control system that tracks changes in your codebase by creating snapshots of your files at specific moments in time. Each snapshot represents a version of your project, allowing you to review history, revert changes, and collaborate with other developers without overwriting each other's work.

GitHub is a cloud-based hosting platform for Git repositories that provides remote storage, collaboration tools, and a web interface for managing your projects. Think of Git as the version control engine running on your local machine, whilst GitHub serves as the centralised server where your team's code lives.

This combination is fundamental to modern software development because it enables:

- **Collaboration**: Multiple developers working on the same project simultaneously
- **Version history**: Complete audit trail of who changed what and when
- **Backup**: Remote storage protects against local machine failures
- **Code review**: Pull requests facilitate peer review before merging changes
- **Deployment integration**: Connect to CI/CD pipelines for automated testing and deployment

## How I used Git and GitHub in this project

In this project, I configured Git on an AWS EC2 instance running Amazon Linux, connected it to a GitHub repository, and established a complete version control workflow. This demonstrates a common DevOps pattern where application code is version-controlled and synchronised between development environments and remote repositories.

This project took me approximately 1-2 hours to complete, including time spent understanding authentication mechanisms and testing the complete workflow. The most valuable lesson was understanding the distinction between local and remote repositories, and how Git's staging area provides a checkpoint before committing changes.

---

## Understanding Git and GitHub

### Installing Git on Amazon Linux

Git is a command-line tool that must be installed on your development environment. On Amazon Linux 2, I installed Git using:

```bash
sudo dnf update -y
sudo dnf install git -y
```

**Command breakdown:**

- `sudo` - Executes the command with administrative privileges
- `dnf` - The package manager for Amazon Linux 2 (replaces `yum` in newer versions)
- `update -y` - Updates the package repository index; `-y` automatically confirms prompts
- `install git -y` - Installs the Git package

**Why update before installing:**
Running `dnf update` ensures you're installing the latest available version of Git with all security patches applied. This is a best practice for any package installation.

### Local vs Remote Repositories

**Local repository:**
A local repository resides on your EC2 instance (or local machine) and contains your project files plus Git's version history stored in a hidden `.git` folder. This is where you make changes, create commits, and manage branches.

**Remote repository:**
A remote repository (in this case, on GitHub) serves as the authoritative source of truth for your project. It's where team members push their changes and pull updates from collaborators. The remote repository doesn't contain your working files—only the Git history and committed changes.

The relationship between local and remote is established through a connection called "origin," which is simply a bookmark pointing to your GitHub repository's URL.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-devops-github_efaadbf7)

---

## Initialising a Git Repository

### Creating a Local Repository

To start tracking version control in my project directory, I ran:

```bash
git init
```

**What this command does:**

- Creates a hidden `.git` folder in your current directory
- Initialises the folder as a Git repository
- Establishes the default branch (traditionally called "master" or "main")
- Begins tracking changes to files in this directory

**Understanding branches:**
A branch represents an independent line of development. The default branch created by `git init` serves as your main codebase. Later, you can create additional branches for features or experiments without affecting the main branch, then merge them back when ready.

**After initialisation:**
The terminal confirms that an empty Git repository has been initialised and shows the default branch name. At this point, your files are untracked—Git knows they exist but isn't recording their changes until you explicitly add them.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-devops-github_7bf21bae)

---

## The Git Workflow: Add, Commit, Push

Git uses a three-stage workflow to track and synchronise changes:

### Stage 1: Adding Files (git add)

```bash
git add .
```

**What the staging area does:**
The staging area (also called the "index") is a holding zone where you prepare changes before committing them. This two-step process allows you to review what will be included in the next commit, ensuring you don't accidentally commit unwanted files.

**Command syntax:**

- `git add .` - Stages all modified and new files in the current directory
- `git add filename.txt` - Stages a specific file
- `git add *.js` - Stages all JavaScript files

**Best practice:** Review staged changes using `git status` before committing to verify you're including the correct files.

### Stage 2: Committing Changes (git commit)

```bash
git commit -m "Updated index.jsp with new content"
```

**What commits represent:**
A commit is a snapshot of your project at a specific moment, along with metadata (author, timestamp, message). Each commit has a unique identifier (SHA hash) and forms part of your project's permanent history.

**The `-m` flag:**
The `-m` flag allows you to provide a commit message inline. Commit messages should be concise but descriptive, explaining _why_ the change was made, not just _what_ changed.

**Without `-m`:** Git opens a text editor for you to write a longer, multi-line commit message.

### Stage 3: Pushing to Remote (git push)

```bash
git push -u origin master
```

**Command breakdown:**

- `git push` - Uploads local commits to the remote repository
- `-u` - Sets the upstream tracking relationship, so future `git push` commands know where to send changes
- `origin` - The name of your remote repository (conventionally called "origin")
- `master` - The branch you're pushing to

**What happens during push:**
Git compares your local commits with the remote repository, then transfers only the new commits to GitHub. This synchronises your local work with the remote repository, making it visible to collaborators.

---

## Authentication with GitHub

### Local Git Identity Configuration

Before making commits, Git requires your name and email address:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Why this matters:**
Every commit records the author's identity for accountability and collaboration. The `--global` flag applies these settings to all repositories on your machine. Without this configuration, Git will prompt you for identity information before allowing commits.

Verify your configuration with:

```bash
git config --list
```

### GitHub Personal Access Tokens

GitHub discontinued password authentication for Git operations in 2021, requiring Personal Access Tokens (PATs) instead. A PAT is a secure, revocable credential that grants specific permissions to your repositories.

**Creating a Personal Access Token:**

1. Navigate to GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Provide a descriptive name and set an expiration period
4. Select scopes: At minimum, enable `repo` (full control of private repositories)
5. Generate and immediately copy the token—you cannot view it again

**Using the token:**
When Git prompts for your password during `git push`, paste your PAT instead of your GitHub password. For convenience, you can configure Git to cache credentials:

```bash
git config --global credential.helper cache
```

This caches your token for 15 minutes by default, avoiding repeated prompts.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-devops-github_fa11169d)

---

## Creating a README File

A README.md file serves as the front page of your repository, providing essential information for anyone viewing your project. Written in Markdown (a lightweight markup language), it renders with formatting on GitHub's web interface.

**Essential README sections:**

1. **Project title and description**: What the project does
2. **Installation instructions**: How to set up the project locally
3. **Usage examples**: How to run or use the application
4. **Technologies used**: Programming languages, frameworks, and tools
5. **Contributing guidelines**: How others can contribute
6. **Licence information**: How the code can be used

Markdown syntax makes READMEs readable as plain text whilst supporting formatting like headers (`#`), bullet points (`-`), code blocks (` ``` `), and links (`[text](url)`). This ensures your documentation is accessible whether viewed on GitHub, in a text editor, or on the command line.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-devops-github_c94976902)

---

## Conclusion

This project demonstrated the fundamental workflow for version control using Git and GitHub, establishing a foundation for modern DevOps practices. By connecting an AWS EC2 instance to a remote GitHub repository, I created a complete development environment where code changes are tracked, versioned, and safely stored remotely.

**Conclusion**

- Git provides local version control through commits and branches
- GitHub serves as remote storage and collaboration platform
- The add-commit-push workflow creates a checkpoint system for your code
- Personal Access Tokens provide secure authentication for Git operations
- README files document projects using Markdown for readability

This project forms part of a DevOps series where I'm building a CI/CD pipeline. The next project will integrate automated testing and deployment, leveraging this Git workflow to trigger builds whenever code is pushed to GitHub—demonstrating how version control serves as the foundation for continuous integration and delivery.
