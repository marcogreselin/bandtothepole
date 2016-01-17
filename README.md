# The Band to the Pole
This is what me, Lukmaan Kolia and Chantal Marin have developed as part of the Apps Design module at UCL. Our client, Microsoft UK, asked us to use the Microsoft Health SDK and the Microsoft Band to develop an app to use during an expedition organised in April 2016 for charity.

We created a mobile-first website that shows data from Health including the position of the explorers on a map and a few more inputs. The goal is to boost donations for the charity through increased engagement.

The site is designed to be deployed on Microsoft Azure as a Web App and uses node.js for the backend.

**Click [here] to access the live demo. (un/pw: pole).**

## Installation
To quickly check out the UI, open `index.html` in the `public`. If you want to use Chrome, run a local server.

To deploy, change the date variables in `apiCalls.js` and on the `index.html` page. Then add your `refreshToken`s in `apiCalls.js`. Deploy to Azure using Git.

## Key Features implemented
- Daily data retrievement from Health and storage as JSON file.
- Highly customozed map showing the position of the explorers every day (they need to make one activity every day).
- Fully responsive (Bootstrap based). Metro UI concepts applied everywhere.
- Graphs to measure distance and calories (use Chart.js).
- Animation that reproduces the heart rate of a chosen explorer. 
- Filters to select an explorer.
- Bar showing the days left to the end of the expedition.
- Tracked donations so that we know the conversion rate donors/visitors. 
- Totally automated workflow: from calls to MS Health to chart generation.

[here]: http://bandtothepoledemo.azurewebsites.net
