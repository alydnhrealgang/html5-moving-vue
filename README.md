# HTML5-MOVING-VUE

**html5-moving-vue** is a tool for you moving in/out.
You can simplely deploy this tools in your home pc or laptop, and using it on web browser in your mobile phones(Safari, Chrome).
There is a server-side project named **moving** written in golang you can find it [here](https://github.com/alydnhrealgang/moving) and follow its instructs to deploy.

# Overview
This moving application offers organizing your stuffs when you moving out and you will get information list of organized articles in each boxes.

- Use the camera on mobile phone as a barcode scanner.
- Easily to create/update/delete boxes and articles after a barcode scanned.
- Easily moving articles from one box to another.
- You will get a complete inventory of mainifests on each **BOXES**.

# Concepts
The ideas of **moving** tools consists of 3 parts:

- **BOX** is a container that can hold various **ARTICLES**. The most important feature of a box is its "code," which can be represented by a barcode label that you affix onto it.
- **ARTICLE** represents an individual item or a group of items (such as a collection of photos you've taken). The primary characteristic of an article is its "code" which is the same as the **code** for a **BOX**. It also includes a "parent code" that indicates the box to which it belongs.
- **CART** is a virtual **BOX** that does not exist as a physical **BOX**. You can think of it as a shopping cart that you fill with items you want to buy when you're shopping. You can then select some of those **ARTICLES** and place them into a physical **BOX**.