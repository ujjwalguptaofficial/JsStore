# Contributing

From opening a bug report to creating a pull request: every contribution is appreciated and welcome. If you're planning to implement a new feature or change the api - please create an issue first. This way we can ensure that your precious work is not in vain.

Thing that should not be change - 

1. package.json
2. ignore files like - gitignore, npmignore
3. travis config
4. license
5. webpack config
6. tsconfig
7. tslint 
8. do not commit anything in dist folder        

These are the files which contains some config & makes the jsstore bug free thats why we dont want user to change as thing may become messy. But we understand that sometimes you need to change these things, so in that case please give a description files name with reason of why you need to change in the pull request.

## Issues

There may be different types of bugs - 

* You are getting wrong set of results like this one - https://github.com/ujjwalguptaofficial/JsStore/issues/40
* Api is throwing error or for particular situation its not working
* You want to have any feature that you think will make jsstore incredible like - https://github.com/ujjwalguptaofficial/JsStore/issues/44
* Any advanced level suggestion or report - speed, optimization of code, some tech suggestion, memory oveflow etc
* You want an example for particular set of library or tech like - how to use in electron, react, angular etc.
* You have problem in learning or something particular is not working for you etc.

The last one is actually not an issue realted to jsstore, its a particular problem for someone. So we dont want such type of issue on our board. Please ask this at different forums like - stackoverflow etc.

## Documentation

If you find some mistakes ( anything like spelling or design etc.) or want to improve the docs. Please feel free to send the PR. 

Our documentation is on another repo - https://github.com/ujjwalguptaofficial/jsstore.docs . So please have a look at contrubuting guidelines.

## Learning Contribution

Learning can be promoted by many ways like - 

* An article
* Examples
* Tutorial - text or video
* jsfiddle, codeplunk etc. demo

if you have anything that helps users learn jsstore and you want them to list on our board. Feel free to link those in our get_started page.

## Setup

Setting up jsstore in your local is very easy - 

* Just fork and clone or just clone
* Run npm install - this will install all dependencies
* There are multiple commands that you can see in package.json.

#### Commands

* lint - Run linter for every codes
* test:dev - Test the development code
* test:prod - Test the production code
* build:dev - Build the code for development
* build:prod - Build the code for production
* build:ci - Build the code that needed by CI
* webpack:dev - run the webpack config for dev
* webpack:prod - run the webpack config for prod
* deploy - This one create both dev and prod code and also test both codes. This is used when some new version is to be deployed.   

## Submitting Changes

After getting some feedback, push to your fork and submit a pull request. We
may suggest some changes or improvements or alternatives, but for small changes
your pull request should be accepted quickly.

Some things that will increase the chance that your pull request is accepted:

* Follow the existing coding style
* Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
* Do not add anything inside the dist folder

## Discussions

Gitter is only for small questions. To discuss a subject in detail, please send a link to your forum or blog in the Gitter chat.