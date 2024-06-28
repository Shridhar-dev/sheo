import { useState, useEffect } from 'react';

// Custom hook to save state to local storage
function useCurrentUser() {
  // Retrieve stored value from local storage, if available
  const jwt = localStorage.getItem("sheo-jwt")
  const user = localStorage.getItem("sheo-user")

  // Update local storage when state changes
  if(jwt && user) return [jwt, JSON.parse(user)];
  else return [null, null]
}

export default useCurrentUser;