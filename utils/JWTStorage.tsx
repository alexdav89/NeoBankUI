import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export class JWTStorage {
  
  private static jwtKey = "user_jwt";

  // Save JWT token
  static async saveToken(token: string) {
    if (Platform.OS === "web") {
      // Use cookies for web storage
      document.cookie = `${this.jwtKey}=${token}; path=/; secure;`;
    } else {
      try {
        await SecureStore.setItemAsync(this.jwtKey, token);
      } catch (error) {
        console.warn("SecureStore failed, using AsyncStorage", error);
        await AsyncStorage.setItem(this.jwtKey, token);
      }
    }
  }

  // Get JWT token
  static async getToken(): Promise<string | null> {
    if (Platform.OS === "web") {
      return this.getCookieToken();
    } else {
      try {
        const token = await SecureStore.getItemAsync(this.jwtKey);
        return token || null;
      } catch (error) {
        console.warn("SecureStore failed, falling back to AsyncStorage", error);
        return await AsyncStorage.getItem(this.jwtKey);
      }
    }
  }

  // Remove JWT token
  static async removeToken() {
    if (Platform.OS === "web") {
      document.cookie = `${this.jwtKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    } else {
      try {
        await SecureStore.deleteItemAsync(this.jwtKey);
      } catch (error) {
        console.warn("SecureStore failed, using AsyncStorage", error);
      }
      await AsyncStorage.removeItem(this.jwtKey);
    }
  }

  // Get JWT from cookies (for web)
  private static getCookieToken(): string | null {
    const match = document.cookie.match(new RegExp(`(^| )${this.jwtKey}=([^;]+)`));
    return match ? match[2] : null;
  }
}
