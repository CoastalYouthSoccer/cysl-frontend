# CYSL Frontend

This is a SPA for CYSL.

## 💿 Install

``` bash
npm install
```

## 💡 Usage

This section covers how to start the development server and build your project for production.

### Starting the Development Server

To start the development server with hot-reload, run the following command. The server will be accessible at [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

### Debugging

Setup Chrome in debug mode

```
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-dev

# Linux
/opt/google/chrome/chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-dev

# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\chrome-dev-profile"
```

Setup VSCode by adding the following to `launch.json`
```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach to Chrome",
      "type": "chrome",
      "request": "attach",
      "port": 9222,
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```

1. Start debugging by clicking on `Attach to Chrome`.
2. Set breakpoints
3. Run application

### Building for Production

To build your project for production, use:

```bash
npm run build
```
