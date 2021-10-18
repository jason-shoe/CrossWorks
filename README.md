# CrossWorks

## Architecture
 - Frontend
   - Framework: React 
   - Language: Typescript
   - Styling: Sass modules
 - Backend
   - Framework: Java Spring

## Cloning the Repository
1. `git clone git@github.com:jason-shoe/CrossWorks.git`


## Running the Frontend
First Time:
1. `cd frontend`
2. `npm install`
3. `npm install sass`

Running Everytime:
1. `cd frontend`
2. `npm start`

## Running the Backend
```./gradlew bootRun```

## Workflow
1. Create an issue or find an issue in the Issue tab. If making an issue, make sure to fill in the blanks and add a frontend/backend label to the issue
2. Checkout to main, pull, and then make a new branch and do changes there.
3. Commit and push changes.
4. Create PR and make sure its properly linked to Github issue
5. Merge the PR

## Coding Standards
Frontend
- Always use functional components. Never use class components
- Always use `React.memo` for functional components.
- Keep styling as modular as possible. Try not to reuse same stylesheet for multiple components.

Backend
- ```./gradlew bootRun```

## Common GitHub Commands
**Making Changes**
1. `git checkout main` (make sure you're on your local repository's main branch)
1. `git pull origin main` (sync up your local repository with the remote one on Github)
2. `git checkout -b <branchname>` (create a new branch after syncing)
3. Make your changes
4. `git status` (shows the files that you've changed)
5. `git add .` (adds all the files to be)
6. `git commit -m <commit message name>` (puts all the files you added in a commit)
7. `git push origin <branchname>` (sends the commit to the remote repository)
8. Make a pull request in the Github repo

**Updating your branch**
After making a branch and performing changes on files to that branch, there is a possibility that someone else was editing and merged some of the same files as you.
1. `git checkout main`
2. `git pull origin main`
3. `get checkout <branch you were on>`
4. `git fetch`
