# Mango Demo

To install this project in a Mango server, first you need to run:

```shell
yarn install
```

Then, run

```shell
yarn webpack
```

Next, in your Mango server, create a directory called `mangoDemo` inside the public File Store and upload the `web` folder 
from the project.

Go to **UI settings** and in  **Miscellaneous settings** > **User module URL** select `mangoDemo.js` from the `web` folder, 
click **Save** at the top.

Reload the page, and you should be able to see the demo pages.

To load demo data you can upload the data point json files inside `edc/demoData`, `hvac/demoData`, and `oilGas/demoData`. 
You can import these json files in the **Configuration** page Import/Export page (you can go to this page from the **Admin home**).

To update the theme, copy `mangoUI-settings.json` file content from the `config` folder into the JSON store called `mangoUI-settings`.
