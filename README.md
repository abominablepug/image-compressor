# What is it?
The following is a Command-line utility built with Node and the sharp library in order to compress all image files within a directory.
## How to use it?
To use the utility run the application with node and then add some parameters:
-i or --input adds the input folder for the images (required)
-o or --output adds the output folder for the images (same as input if not specified)
-w or --width adds the width of the resized image (required)
0h or --height adds the height of the resized image (same as width if not specified)
## Purpose
The utility was made in order to quickly and efficiently resize images and has proper and specified error handling to assist the user
## Notice
All file paths are based of the current working directory and aren't absolute!!!
