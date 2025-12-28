---
title: "Unraveling the Trinity of Software: Data, Model, and State - More Complex Than You Might Think"
date: "2024-10-19"
tags: ["Tech"]
featured: false
description: "https://imgflip.com/i/977ves/assets/images/blog/124835c2-e62f-804b-b1ef-c16fe5c91f55-1.png https://imgflip.com/i/977ves In the world of software development,..."
readTime: "4 min"
image: "/assets/images/blog/cover-124835c2-e62f-804b-b1ef-c16fe5c91f55.jpg"
---

![https://imgflip.com/i/977ves](/assets/images/blog/124835c2-e62f-804b-b1ef-c16fe5c91f55-1.png)
<figcaption class="notion-caption">https://imgflip.com/i/977ves</figcaption>

In the world of software development, three terms often pop up in discussions, code comments, and documentation: **Data**, **Model**, and **State**. At first glance, these concepts might seem interchangeable or straightforward. However, as you delve deeper into software architecture and design, you'll find that understanding the nuances between these terms is crucial for effective development and clear communication within your team.

Let's start with simple definitions, **data represents information**, **model represents system**, and **state represents condition**. A bit abstract isn't it? Here some more explanation and examples.

## Data

Say you have a user informations. He has ID, name, address and phone number. To represents this user you would create a data class.

```dart
class UserData {
	final String id, name, phoneNum;
	const UserData(this.id, this.name, this.phoneNum);
}
```

By the nature of information, it typically could be changed. So for data class it could be either immutable or mutable. I’ll show you more later why nowadays we trend toward immutable data classes.

## Model

Great, you have represent your user data. Now you want to model their behavior. Say a user would typically do

- place order and
- confirm order received

To represent this behavior you would create a model class.

```dart
class UserModel {
	void placeOrder(List<Item> items);
	void confirmOrder(String orderId);
}
```

## State

Excellent, you have represent your user behavior. Now you notice that it only consist of methods. How do this model works without nothing tracking it results and condition? Nice, now please welcome, state.

```dart
class UserState {
  final Order? order;
  const UserState({this.order});
}
```

Feels Déjà vu? Yes it’s very similar to data class. The similarities is due to state also hold information. The different are on the context, where State is all about **capturing the "now" of your system**, think it as a snapshot of the running system. Typically when we talk about data it would be immutable while state it would be mutable.

## Integrations of The Three

We have cleared the differences of the three. Now lets see how to integrate all three into a single component.

```dart
class UserModel {
  final UserData userData;
  final OrderService service;
  
  // create a UserModel with given userData and service
  // then prepare initial state
  UserModel(this.userData, this.service) :
     state = UserState();
  
  UserState state;
  
  Future<void> placeOrder(List<Item> items) async {
    // place order of items for given user data
    final newOrder = await service.order(items, userData.id);
    state = UserState(order: newOrder)
  }

	Future<void> confirmOrder(String orderId) async {
	  // user tried to confirm order not his, so ignore
	  if (state.order.id != orderId) return;
	  
	  await service.confirm(state.order);
	}
}
```

This simplified example shows the integration and interaction of all 3 class. You could see that model holds data as well as state. While state is a data itself. This is the reason why they are seems like interchangeable.



To help clarify these concepts, let's look at following comparison table:

| Aspect | Data | Model | State |
| --- | --- | --- | --- |
| Focus | Information | Representation | Current Condition |
| Nature | Can be static or dynamic | Generally static | Always dynamic |
| Primary Use | Storage, transfer, processing | System design, business logic | Tracking current system condition |
| Examples | JSON objects, database records | Domain models, architectural designs | Shopping cart contents, user session |
| Persistence | Often persistent | Conceptual, may be persisted as data | Usually transient |

## Conclusion

In conclusion, while Data, Model, and State may seem like simple concepts at first, they carry nuanced meanings in the world of software development. By understanding these nuances and using the terms thoughtfully, you can improve your code organization, enhance team communication, and ultimately create more robust and maintainable software systems.

So the next time you're discussing your project, take a moment to consider: are you talking about Data, a Model, or State? Remember, the goal isn't to rigidly categorize every concept, but to use these terms in a way that enhances understanding and leads to better software design.

## Bonus

As promised earlier, i’ll explain a bit why nowadays we trend toward immutable data classes. It’s in accordance to relatively new concept called **Unidirectional Data Flow** (UDF). It’s a design pattern where state flows down and events flow up.

![https://developer.android.com/develop/ui/compose/architecture](/assets/images/blog/124835c2-e62f-804b-b1ef-c16fe5c91f55-2.png)
<figcaption class="notion-caption">https://developer.android.com/develop/ui/compose/architecture</figcaption>

UDF mandates that state change should only happen in one place while UI should only reflect it and not modify it. This require state to be an immutable object where UI can’t modify it. Therefore we nowadays mainly implement immutable state and data, to prevent any unintended change to the state.
