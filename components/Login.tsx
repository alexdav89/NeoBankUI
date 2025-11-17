import { useAuth } from '@/hooks/useAuth';
import { JWTStorage } from '@/utils/JWTStorage';
import axios from "axios";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");

  const isLoggedIn = useAuth();

  const handleLogin = async () => {
    
    //router.replace("/(tabs)"); //for testing disable login screen

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    console.log(apiUrl);
    try {
      const response = await axios.post(apiUrl+"api/auth/login", {
        email,
        password,
      });

      setToken(response.data.data.token);
      await JWTStorage.saveToken(response.data.data.token);
      console.log("response.data.token" + response.data.data.token);
      setError("");

      router.replace("/(protected)/(tabs)");
    } catch (err: any) {
      // Check if it's a 401 Unauthorized error
      if (err.response?.status === 401) {
        setError("Password or username incorrect");
      } else {
        // Check if the server sent a specific error message
        const serverMessage =
          err.response?.data?.message || "Something went wrong. Please try again.";
        setError(serverMessage);
      }
    }

  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Email</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        accessibilityLabel="email"
      />
      <ThemedText style={styles.label}>Password</ThemedText>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          accessibilityLabel="password"
        />
        <ThemedView style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} />
        </ThemedView>
      </form>
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Login;
