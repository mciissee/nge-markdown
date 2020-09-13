# A

**Table of contents:**

1. [🖥 Environment Support](#environements)
2. [📦 Installation](#installation)
3. [🚀 Angular Quick Start](#ng-quickstart)
4. [🚀 Nx Quick Start](#nx-quick-start)
5. [⌨️ Development](#development)
   - [IDE](#ide)
   - [Serve](#serve)
   - [Build](#build)
   - [Running tests](#tests)
   - [Understand the workspace](#workspace)
   - [Further help](#help)
6. [🔨 Project Architecture](#architecture)
7. [🤝 Contributing](#contributing)

## 🖥 Environment Support <a name="environements"></a>

- Angular `^9.0.0`
- Modern browsers and Internet Explorer 11+ (with [polyfills](https://angular.io/guide/browser-support))

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera | |
| --------- | --------- | --------- | --------- | --------- | --------- |
| IE11, Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions

## 📦 Installation <a name="installation"></a>

- Open a terminal window and run the following commands

```bash
git clone https://github.com/PremierLangage/platon-front
cd platon-front
./scripts/install.sh
```

 This script will check and install if needed the following npm packages globally in the npm registry of your system:

- [Npm](https://www.npmjs.com/get-npm) node package manager.
- [Angular CLI](https://cli.angular.io) command-line interface tool that is used to initialize, develop, scaffold, and maintain Angular applications.
- [Nx CLI](https://nx.dev/angular/cli/overview) a set of Angular CLI power-ups for modern development.

> You may need to run the script in sudo mode.

## 🚀 Angular Quick Start <a name="ng-quick-start"></a>

[Angular beginner tutorial](https://angular-templates.io/tutorials/about/learn-angular-from-scratch-step-by-step)

[Angular References](https://ngrefs.com)

TODO CUSTOM GUIDE COMING SOON

## 🚀 Nx Quick Start <a name="nx-quick-start"></a>

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/angular/getting-started/what-is-nx)

[Nx Interactive Tutorial](https://nx.dev/angular/tutorial/01-create-application)

## ⌨️ Development <a name="development"></a>

### IDE  <a name="ide"></a>

We recommend you to use [Visual Studio Code](https://code.visualstudio.com/) as your code editor for your development environment.
This code editor comes with an out of box support of Angular ecosystem.

Also we recommend you to install the [Angular Essentials](https://marketplace.visualstudio.com/items?itemName=johnpapa.angular-essentials) extension inside vscode.
This extension provides a set of tools (snippets, graphical CLI, language service...) that power up Angular development.

### Serve <a name="serve"></a>

Run the script `./scripts/serve.sh` for an Angular dev server and navigate to `http://127.0.0.1:4200`. The app will automatically rebuild if you change any of the source files.

### Build <a name="build"></a>

Run the script `./scripts/build.sh` to build the project in a production mode. The build artifacts will be stored in the `dist` directory.

### Running tests <a name="tests"></a>

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Run `nx affected:test` to execute the unit tests affected by a change.

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

### Understand the workspace <a name="workspace"></a>

Run `nx dep-graph` to see a diagram of the dependencies of the project.

### Further help <a name="help"></a>

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

## 🔨Project Architecture <a name="architecture"></a>

```txt
|   apps/
|       platon/
|           src/
|               app/
|                 pages/
|                   app.component.[ts|scss|html]
|                   app.module.ts
|             assets/
|             environments/
|                 environment.ts
|                 environment.prod.ts
|             index.html
|             styles.scss
|           webpack.externals.js
|        platon-e2e
|   dist/
|     apps/
|       platon
|   libs/
|       core/
|         src/
|           lib/
|       shared/
|           src/
|             lib/
|               assets/
|               styles/
|               ui/
|               utils/
|               vendors/
|       webcomponents/
|           src/
|             lib/
|   scripts/
|     build.sh
|     install.sh
|     serve.sh
|   tools/
|     schematics/
|       webcomponent
| angular.json
| nx.json
| package.json
| tsconfig.json
```

TODO...

## 🤝 Contributing <a name="contributing"></a>

We welcome all contributions. Please read our [CONTRIBUTING.md](https://github.com/PremierLangage/platon-front/blob/master/CONTRIBUTING.md) first. You can submit any ideas as [pull requests](https://github.com/PremierLangage/platon-front/pulls) or as [GitHub issues](PremierLangage/platon-front/issues).

!!! note
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod
    nulla. Curabitur feugiat, tortor non consequat finibus, justo purus auctor
    massa, nec semper lorem quam in massa.
