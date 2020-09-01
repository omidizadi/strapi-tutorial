"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  getAllHeroes: async (ctx) => {
    var heroes = await strapi.query("remote-config").find({ type: "hero" });

    var modifiedList = [];

    heroes.forEach((hero) => {
      modifiedList.push({
        name: hero.name,
        type: hero.type,
        data: hero.data,
      });
    });

    return modifiedList;
  },
};
