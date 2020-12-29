
# Setup a Simple Server-Side Application for Your Game Using Strapi.js — Part 2

Create a simple Remote Config for an RPG game

![](https://cdn-images-1.medium.com/max/2880/0*RgPdt93K5OjOIRY0)

* [*Part 1 — *Setup Strapi](https://medium.com/@Omidizadi/setup-a-simple-server-side-application-for-your-game-using-strapi-js-part-1-6833308422dc)

* *Part 2 — *Create Remote Config

* [*Part 3 — Calling API from Unity](https://medium.com/@Omidizadi/create-a-simple-web-application-for-your-game-using-strapi-js-part-3-853a49091479)*

📎 [source code to this tutorial at GitHub](https://github.com/omidizadi/strapi-tutorial)

In the [previous part](https://medium.com/@Omidizadi/setup-a-simple-server-side-application-for-your-game-using-strapi-js-part-1-6833308422dc), we successfully installed and ran a Strapi application. Now it is time to build the API. But first, let’s take a close look at what a game server like this can provide us:

* It can authenticate users.

* We can implement game logic.

* Users can see leaderboards.

* We can change some of the game elements through the server.

* and lots of other functionalities.

### Controllers, Services, and Routes

For building an API in Strapi, you need to understand 3 main concepts.

**Services: **Services serve as global methods that you can use everywhere in your application. Their main job is to reduce the use of some repeatable functions by being available globally.

**Controllers: **Controllers are the main part of your API. The main functions go here.

**Routes: **Routes are bounded to controller methods. They are actually Urls which are pointing to a specific method, so each time you call that Url the method gets executed.

Know that you’re familiar with these 3 concepts, we are ready to create a remote config system for our game.

## Remote Config

### Creating Model

Let’s say we have an RPG game with different heroes, hero types, buildings, maps, items and etc. Each hero has its own specifications such as damage power (if it is melee), range (if it’s of range type), health, mana, and so many other parameters. These things need to be balanced and tweaked by game designers frequently. So it is not a good idea to put them inside the client. The best solution is to get all of those data from your server at the very beginning of the game and keep them for later use.

For creating such functionality, the very first step is to create a model of data. It should be one single model to cover everything that needs a config in the game, such as heroes, hero types, items and etc. So we need these fields:

* **Name ***(it defines to what specific part of the game, this object belongs)*

* **Type ***(it tells us the type of this object)*

* **Data ***(the main data that we want to tweak or adjust later)*

Now that we have a model in mind, we open Strapi’s admin panel:

![Strapi admin panel](https://cdn-images-1.medium.com/max/3840/1*kRNh1HY-nIPsLvnGHl3zlg.png)*Strapi admin panel*

here you can see that Strapi has already made a collection (or content-type) called Users. We need something like that for our Remote Config. A collection that stores our config data.

open the *Content-Types Builder:*

![](https://cdn-images-1.medium.com/max/3840/1*pViOCFdLDRXQOabo92lqHg.png)

under the *Collection Types* in the grey column, you can see the blue text saying *Create new collection type*. Click on it:

![](https://cdn-images-1.medium.com/max/3840/1*g-muaon9yN5YW79wCNt3nA.png)

a window pops open. In the Display name write *Remote Config* and press *Continue*. Now you can see this window:

![](https://cdn-images-1.medium.com/max/3840/1*ah0C4qwveI79wW0qJ2RM7A.png)

here you should create those 3 fields that we talked about. *Name*, *Type, *and *Data*. For name, you can choose *Text *or *UID*. I recommend you select *UID *because it guarantees that the content of that field is unique in the entire collection. So I select the *UID*:

![](https://cdn-images-1.medium.com/max/3840/1*zzG_8X7p6zafFAXDcpYPuw.png)

inside the Name field, write *name (with the small letter because it’s better :) )*

and click on *+Add another field*, For our *Type *field you can select *Text*:

![](https://cdn-images-1.medium.com/max/3840/1*Kw-7vKCwtljBkPax8vqwQQ.png)

![](https://cdn-images-1.medium.com/max/3840/1*-yBXM9EDNifU35_yBK58Mg.png)

in the Name field, write *type *and keep the *Short text* checked. Because the type of every object should not be so long. Then click on*+Add another field*:

now for the most important field, Data, we choose *JSON*:

![](https://cdn-images-1.medium.com/max/3840/1*WLZVA2rHUynYveuON5oB6A.png)

type *data* in lower case and click on *Finish*.

![](https://cdn-images-1.medium.com/max/3840/1*i-jlxJ7iUZx_vLNEo6s12Q.png)

you can see that your model for the new Remote Config collection is ready. Click on the green *Save *button and wait until the application restarts:

![](https://cdn-images-1.medium.com/max/3840/1*621K_uuoIAOVAbg0nvgZzQ.png)

after a moment, you can see a new collection appeared above the Users collection:

![](https://cdn-images-1.medium.com/max/3840/1*CshJX1Wk_9PuyQ6-5S-8dA.png)

good. Now, let's add a bunch of data to it. Click on *Add New Remote Config*:

![](https://cdn-images-1.medium.com/max/3840/1*vubYeaY2cMuEsFuJ9a6Oug.png)

here we want to add the data for a melee hero called *Darius* — a tough one :)

![](https://cdn-images-1.medium.com/max/3840/1*sKcX_yzE7sQa0ZZj89SnPQ.png)

for its type, I write *hero *because that’s the key to get all heroes data by just one API call.

the data field is something like this:

    {
      "health": 200,
      "healthPerLevel": 2.5,
      "damage": 160,
      "damagePerLevel": 3.5
    }

just a simple JSON object. Now that we are done, I click on the *Save* button.

I added a bunch of heroes here:

![](https://cdn-images-1.medium.com/max/3840/1*LaF3gIpRgc7XYET9mmGU7Q.png)

you can add other types of objects like this, and put different data inside it. And that’s the power of the JSON fields. Although it is the same collection, Data fields can be different.

Now how can we get all of these objects in the client?

There are two ways:

* **Strapi’s built-in API Endpoints**

* **Custom API Endpoints**

Let’s start with the first and the easier one:

Let’s say we want to get the config data for all the heroes. Navigate to *Roles and Permissions *under the plugins:

![](https://cdn-images-1.medium.com/max/3840/1*p11yZPpdztbSmmzmfLB55A.png)

Click on the pen icon in front of the *Public *section:

![](https://cdn-images-1.medium.com/max/3840/1*z8KAWgQ-cwE0KjJWStDxig.png)

at the bottom of the page, you can see *Remote Config *with a bunch of options below it. Check the *find *option.

On the right-hand side this information appears:

![](https://cdn-images-1.medium.com/max/2000/1*d2mLYf0tQDqH95jGKGJMkw.png)

it tells you how to access the remote-config.find method. Remember the GET endpoint.

Press *Save. N*ow open a new tab in your browser and type this:

    [http://localhost:1337/remote-configs](http://localhost:1337/remote-configs)

you can see that the Strapi return the list of all elements present in the Remote Config collection. But we don’t need all of them. We want to specify which type of data we want because the way we treat them on client-side would be different. so by typing this in browser:

    [http://localhost:1337/remote-configs?type=hero](http://localhost:1337/remote-configs?type=hero)

![](https://cdn-images-1.medium.com/max/3840/1*KIoA8D9J1H3_p9w7KErM6Q.png)

you only receive objects of type hero. That’s it! It’s ready to be used inside the game. But as you can see, these arrays is so huge and if we make so many of those heroes, It can take a while for our client to get them! and after all, why should I send the objects *createdDate *or *created_by and all those *useless information? We can definitely change that.

open the main directory to your project:

![](https://cdn-images-1.medium.com/max/2000/1*GWqbzlIOtWh8jusec-pTpA.png)

open *api *folder and then *remote-config*:

![](https://cdn-images-1.medium.com/max/2000/1*bIcYSVA8oaTRhkkAd8K41g.png)

here you need to recall the concepts I mentioned earlier. You need to write a method inside the controller (and in services maybe. only if you need to do something repeatedly). And bound a route to the method. Let’s do all of those things really quickly!

go inside the *controllers *folder and open *remote-config.js *with a code editor. I’m using vscode here:

![](https://cdn-images-1.medium.com/max/2694/1*bRdnmpUlup7LT1MiASjVHQ.png)

we should put all of our methods inside the *modules.exports. *So it will be exposed to Strapi. Now we want a method to return only the desired fields of every hero object. Here is the code:

<iframe src="https://medium.com/media/a29b91abe1ee7ad5fc4cdbc2e8fb1cb2" frameborder=0></iframe>

I defined the method *getAllHeroes *and received all objects of type *hero*, kept them in an array called *heroes,* and then extracted only 3 main fields from them and added the modified objects to a new array. And finally, I returned the* *modified array. There are of course better ways to do this but I’m not a fantastic JS programmer so I’m satisfied with this one:)

Now that we have our method, we set a route to it. Navigate to *config *folder and open *routes.json* :

![](https://cdn-images-1.medium.com/max/NaN/1*bIcYSVA8oaTRhkkAd8K41g.png)

![](https://cdn-images-1.medium.com/max/2882/1*88xwhhPfOqPXFhm_HKCEuw.png)

you can see a bunch of JSON objects that bound specific methods to their routes. add this to the top of the list:

    {
      "method": "GET",
      "path": "/remote-configs/heroes",
      "handler": "remote-config.getAllHeroes",
      "config": {
        "policies": []
      }
    }

now save both *remote-config.js *and *routes.json files. *Your server will restart to apply changes and after that, you have to do the same thing that you did to the *find* method in *Roles and Permissions*. Here is a quick snapshot:

![](https://cdn-images-1.medium.com/max/3840/1*p11yZPpdztbSmmzmfLB55A.png)

![](https://cdn-images-1.medium.com/max/3840/1*LwdSX-QQm7nGCFRm496Tyw.png)

![](https://cdn-images-1.medium.com/max/2000/1*Nk93AJu0o3mDgx0yVTtteg.png)

we check the *getallheroes *method and now it is accessible from a simple URL:

    [http://localhost:1337/remote-configs/heroes](http://localhost:1337/remote-configs/heroes)

the result is:

![](https://cdn-images-1.medium.com/max/3840/1*cQsDYA2NdD5tloYCoRkTCA.png)

you can clearly see the difference between this result and the previous one!

So now that we have our API and our endpoints, it’s time to go for tweaking our game client in the [next part](https://medium.com/@Omidizadi/create-a-simple-web-application-for-your-game-using-strapi-js-part-3-853a49091479)!
