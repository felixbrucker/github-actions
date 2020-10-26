FROM node:12-alpine

# Labels for GitHub to read your action
LABEL "com.github.actions.name"="Post release in Discord"
LABEL "com.github.actions.description"="Post a release to Discord"
# Here are all of the available icons: https://feathericons.com/
LABEL "com.github.actions.icon"="message-square"
# And all of the available colors: https://developer.github.com/actions/creating-github-actions/creating-a-docker-container/#label
LABEL "com.github.actions.color"="gray-dark"

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your action's code
COPY . .

# Run `node /index.js`
ENTRYPOINT ["node", "/index.js"]
