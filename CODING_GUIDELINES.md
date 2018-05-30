# Coding Guidelines

We follow strict set of coding guidelines and use linter to make sure no mistake is done. We have inherited our coding guidelines fom google es6 guidelines.

## Naming

* Class Name must be in PascalCase.
* Class public or protect member should be in camelCase.
* Class private member should be in camelCase having '_' in the end.
* A file name should be in snake case.

## Static Member

A static function or variable should not be used directly instead it should be wrap in a private function with get and set.

e.g -
```
class Util{
    static multiply(num1:number, num2:number){
        return num*num2
    }
}
```
now in order to use in another class

```
class Main{
    private multiply_(num1:number, num2:number){
        return Util.multiply(num1,num2);
    }
}

```

## TypeScript guidelines

* Every variable should be staticly typed . If it may accept multiple type then add multiple type or any. Though any is not recommended until and unless there is hard requirement.

## CodeThink Approach

* A class name should clearly explain its behaviour.
* Always intialize and assign member variable in constructor method.
* If there are multiple files which are realted to each other then keep them in a single folder create a es6 mopdule by exporting all of them in a common file index.ts.
* Do not create any global variable instead create a class and add the variable as static.
* Remove something if its not being used. Do not comment and keep it for the future reference.
* Always use arrowType function.
* Always use es6 advanced inbult functions like - findIndex, find etc. If you are using something old js style that is no problem but if you found later on that this can be replaced with es6 then please replace it.