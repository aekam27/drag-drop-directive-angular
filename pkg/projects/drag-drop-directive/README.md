# DrapDropDirective
This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.0.

# Overview

The Angular Drag and Drop Directive (DDDirective) is a custom Angular directive designed to enhance the user experience by enabling drag-and-drop functionality for file uploads. This directive allows users to seamlessly drop individual files or entire directories onto designated elements in your Angular application.

# Installation

To use the Angular Drag and Drop Directive in your Angular application, follow these installation steps:

1. Install the package using npm:
    npm i drag-drop-directive

2. Import the DDDirective in your Angular module:
    import { DDDirective } from 'drag-drop-directive';

3. Add DDDirective to the declarations array in your module:
    @NgModule({
    declarations: [
        // ... other components and directives
        DDDirective,
    ],
    // ...
    })
    export class YourModule { }

# Usage

Basic Usage
    Add the dragDrop attribute to any HTML element to enable the drag-and-drop functionality:
        <div dragDrop (droppedFiles)="handleDroppedFiles($event)"></div>
Output
    The directive emits a droppedFiles event when files are dropped. You can capture this event in your component:
        export class YourComponent {
            handleDroppedFiles(files: File[]): void {
                // Process the dropped files
                console.log(files);
            }
        }

# Features

Visual Feedback
    The directive provides visual feedback by changing the background color of the drop zone during drag-over and drag-leave events.

File and Directory Handling
    The directive supports both individual file uploads and the dropping of entire directories. It emits an array of File objects, including files within dropped directories.

# API

Properties
    droppedFiles: EventEmitter<File[]>: An output event emitter that emits an array of dropped files.
Methods
    onDragOver(evt: DragEvent): void: Handles the dragover event.
    onDragLeave(evt: DragEvent): void: Handles the dragleave event.
    onDrop(evt: DragEvent): Promise<void>: Handles the drop event, processes dropped files, and emits the droppedFiles event.
    traverseFolderTree(content: any): Promise<void>: Recursively traverses the folder tree for dropped directories, collecting files.

# Example

    import { Component } from '@angular/core';
    @Component({
    selector: 'app-example',
    template: `
        <div dragDrop (droppedFiles)="handleDroppedFiles($event)"></div>
    `,
    })
    export class ExampleComponent {
        handleDroppedFiles(files: File[]): void {
            // Process the dropped files
            console.log(files);
        }
    }

