// @ts-nocheck

// petit store global en mémoire pour l'utilisateur connecté

let currentUser: any = null;

export function setCurrentUser(user: any) {
  currentUser = user;
}

export function getCurrentUser() {
  return currentUser;
}
