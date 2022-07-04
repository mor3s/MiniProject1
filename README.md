# MiniProject1

To lauch this code, you need to create a live server using python or a VScode extension.

This visualization is anwering the question :

 >Is there a regional effect in the data? Are some names more popular in some regions? Are popular names generally popular across the whole country ?

To answer this question, we've chosen a choropleth map of the french department. the color represents the difference between the frequency of the names given in the department compared to the one given at natinal level.

Also, when you hover a department, you can see the most given name of this department.

On this visualization, we added also one wordcloud with the top 10 names given in France for the given year, and when you hover a department, another wordcloud with the top 10 of the department appears next to the national one so you can compare the two.

And last, we decided to show the data year by year because we thought it had more sense to see the evolution year by year than having just the whole timestamp.

Each part of this visualization has its importance: 
- The colors are important beacause it allows you to understand the territory disparities in one look. And it allows you to see the evolution year by year (we decided to keep the same color scale to not deceive the viewer and to be able to compare the data between each year).
- The wordsclouds are also crucial to be able to see the name and not only a numerical precomputed value, so it's more transparent, you can compare the color and the two wordsclouds.
- And last the tooltip allow you to get the most given name of the department more precisely than on the wordcloud.
  
  