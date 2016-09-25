Compimag is an utility to compare images and retrieve 
differences between them, uses "get-pixels" to retrieve image data.

Created by: tcardoso@gmail.com
Created on: 11Sep2016


Changes on: 20Sep2016:
<br />    - v.0.1.8:
         - Added requestCompareLast which always compares the current picture taken with the last picture, so it performs better
<br />    - v.0.1.6:
         - Introduced "precision" still a work in progress, reasoning has to do with decreasing precision (i.e. ignoring pixels when comparing 2 images we gain performance at of course the cost of (hopeffuly) negligible informationn. In the future it would be up to the user to decide which precision to apply.
         - Removed processImage out of the object, and can now be called separately passing the object containing the callback.
         - processImage is now executed on background so that it does not block the main thread while new incoming Comparer requests are created; still a work in progress, main problem now is that reading the images is taking longer than new images are being created / deleted, which is obstructing the events stack, which would eventually cause performance problems, and also images are being lost (deletion happens so they are not compared); 
<br />    - v.0.1.5:
         - Fixed bug which was causing program to catch due to void callback
Changes on: 17Sep2016:
<br />    - v.0.1.4: Added callback for comparison of results since getPixels is async
         - Added event emitter for complete event function, user can now attach listeners to it
         - Turned library into one object
Changes on: 17Sep2016:
<br />    - v.0.1.3: First version of the compare function which takes a simplistic approach by just traversing the pixels.data array and only comparing the RED channel between 2 arrays representing 2 pictures.
        - Added "lastFile" which allows compimag remembering the last file passed as first arg of the compare function, so that the user does not have to maintain that for convenience; 
