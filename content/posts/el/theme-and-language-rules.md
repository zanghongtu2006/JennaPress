---
slug: theme-and-language-rules
title: Κανόνες theme και γλώσσας
summary: Οι αναμενόμενοι κανόνες για ισότητα theme, language routing και browser-side persistence στο Jenna Press.
publishedAt: "2026-03-21"
category: Usage
tags:
  - jenna-press
  - usage
author:
  name: Jenna Press
seo:
  title: Κανόνες theme και γλώσσας | Jenna Press
  description: Διαβάστε τους κανόνες που κρατούν προβλέψιμη τη συμπεριφορά theme και γλώσσας.
  canonical: https://www.jennapress.com/blog/usage/theme-and-language-rules/
bodyTitle: Η persistence πρέπει να φαίνεται σταθερή και βαρετή
bodyBlocks:
  - type: cta-banner
    title: Συνεχίστε να διαβάζετε μέσα στο Jenna Press
    description: Χρησιμοποιήστε τις κατηγορίες του blog για να μετακινηθείτε ανάμεσα στο υπόβαθρο του έργου και στην πρακτική καθοδήγηση χρήσης.
    action:
      label: Επιστροφή στο blog
      to: /el/blog
---
Τα themes στο Jenna Press είναι ισότιμοι πολίτες. Τα dark, light και pink πρέπει να αντιμετωπίζονται ως ισότιμα και όχι ως ένα «πραγματικό» theme μαζί με δύο ειδικές περιπτώσεις. Αυτή η αρχή έχει σημασία επειδή οι κρυφοί κανόνες προτεραιότητας συνήθως δημιουργούν bugs στο refresh και σύγχυση στη συντήρηση.

Η συμπεριφορά της γλώσσας πρέπει να είναι εξίσου προβλέψιμη. Τα Αγγλικά είναι ο προεπιλεγμένος route space, ενώ τα Γερμανικά, τα Κινεζικά, τα Ισπανικά και τα Ελληνικά χρησιμοποιούν ρητά locale prefixes. Το browser persistence πρέπει να επαναφέρει την επιλογή του χρήστη χωρίς να αλλάζει το ίδιο το route model.

Με λίγα λόγια, το routing ανήκει στο framework, το περιεχόμενο ανήκει στα content files και η persistence πρέπει να υποστηρίζει και τα δύο χωρίς να δημιουργεί εκπλήξεις.
