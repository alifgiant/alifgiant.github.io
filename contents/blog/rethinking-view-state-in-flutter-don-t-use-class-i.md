---
title: "Rethinking View State in Flutter: Don’t use class inheritance for view state"
date: "2024-04-17"
tags: ["Tech","Flutter"]
featured: false
description: "In the ever-evolving world of software development, efficiency is king. But sometimes, the quest for a robust codebase leads us down a path of unnecessary co..."
readTime: "4 min"
image: "/assets/images/blog/cover-37c21178-634d-4ab1-8851-52fb46abc97c.jpg"
---

In the ever-evolving world of software development, efficiency is king. But sometimes, the quest for a robust codebase leads us down a path of unnecessary complexity, especially when it comes to managing view state. Have you ever considered the impact of your view state choices on your app’s performance and maintainability? Let’s dive into why opting for simplicity could be the game-changer your project needs.

![Simple App with view state](/assets/images/blog/37c21178-634d-4ab1-8851-52fb46abc97c-1.gif)

Traditionally, developers have relied on two patterns for managing view state: class inheritance and simple fields within a state class. While class inheritance has been the go-to for many, it’s not without its drawbacks. To shed light on this, consider a Flutter app’s behavior with both patterns in play. The difference is more than just theoretical—it’s practical, and it’s significant. To illustrate this point, let’s consider a following code implementation.
    ```dart
    abstract class ViewState {
      const ViewState();
    }
    
    class LoadingState extends ViewState {
      const LoadingState();
    }
    
    class ErrorState extends ViewState {
      final String name = 'error';
      const ErrorState();
    }
    
    class SuccessState extends ViewState {
      final String name = 'success';
      const SuccessState();
    }
    ```
      ```dart
    class SimpleState {
      final bool isLoading;
      final bool isError;
    
      const SimpleState({
        this.isLoading = true,
        this.isError = false,
      });
    
      static const String errorText = 'error';
      static const String successText = 'success';
    }
    ```
    ```dart
import 'package:flutter/material.dart';
// import 'package:size_compare/src/class_check.dart';
import 'package:size_compare/src/state_check.dart';

class Utils {
  // dynamic state = const LoadingState();
  dynamic state = const SimpleState();

  void setLoading() {
    // using class inheritance
    // state = const LoadingState();

    // using simple state field
    state = const SimpleState(isLoading: true);
  }

  void setSuccess() {
    // using class inheritance
    // state = const SuccessState();

    /// using simple state field
    state = const SimpleState(isLoading: false, isError: false);
  }

  void setError() {
    // using class inheritance
    // state = const ErrorState();

    // using simple state field
    state = const SimpleState(isLoading: false, isError: true);
  }

  Widget threeState({
    required Widget Function() onLoading,
    required Widget Function(String) onSuccess,
    required Widget Function(String) onError,
  }) {
    // // using class inheritance
    // if (state is SuccessState) return onSuccess(state.name);
    // if (state is ErrorState) return onError(state.name);
    // return onLoading();

    // using simple state field
    final stateSimple = state as SimpleState;
    if (stateSimple.isLoading) return onLoading();
    if (stateSimple.isError) return onError(SimpleState.errorText);
    return onSuccess(SimpleState.successText);
  }
}
```

While Android developers might worry about ***dex size*** and ***class count***, where a higher class count can trigger the dreaded **multi-dex** issue, leading to slower build times and potential complications during runtime. Flutter developers have similar considerations. In Dart, the equivalent would be the compilation to JavaScript for web or machine code for mobile, where the size and count of classes can impact the final build size and performance. Although not directly related to Android’s dex, the principle remains: more classes mean a larger footprint and potentially slower performance.

The proof is in the pudding—or in this case, the screenshots. When we compare the memory footprint of both approaches, class inheritance results in a memory size (0.5 KB) that is **twice** the size of fields in a simple state class (0.2 KB). This not only affects performance but also hampers our ability to scale and maintain the application efficiently.

![Size for View State Inheritance](/assets/images/blog/37c21178-634d-4ab1-8851-52fb46abc97c-2.png)
![Size for Simple View State](/assets/images/blog/37c21178-634d-4ab1-8851-52fb46abc97c-3.png)
## Conclusion
In conclusion, while class inheritance may appear to offer a structured approach to managing view state, the reality is that it can lead to bloated and less performant code. For the sake of size optimization and simplicity, I strongly recommend adopting a simple class structure for your view state. It’s a small change with a big impact. However, it’s important to note that there are exceptions. In cases of **extremely complex view states**, where multiple widgets interact with a plethora of stateful elements, a well-structured class inheritance might provide the necessary organization to keep things manageable. But for the vast majority of applications, simplicity isn’t just beautiful, it’s performant. Embrace the straightforward approach, watch your app and grow accordingly.

