import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { authStyles } from "../../assets/style/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "../../assets/constants/Colors";

const VerifyEmailScreen = ({ email, onBack }) => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState();

  const handleVerification = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        Alert.alert("Error", "Verification failed. please try again");
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      Alert.alert("Error", err.error?.[0]?.message || "Verifiaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* image */}
          <View>
            <Image
              source={require("../../assets/images/i3.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>
          {/* title */}

          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.subtitle}>
            We&apos;ve sent a Verifiaction code to {email}
          </Text>
          <View style={authStyles.formContainer}>
            {/* input box */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter Verfiiaction code"
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>

            {/* verify button */}
            <TouchableOpacity
              style={[
                authStyles.authButton,
                loading && authStyles.buttonDisabled,
              ]}
              onPress={handleVerification}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Verifying..." : "Verify Email"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
              <Text style={authStyles.linkText}>
                <Text style={authStyles.link}>Back to Sign Up </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmailScreen;
