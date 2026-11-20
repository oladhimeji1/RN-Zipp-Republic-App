import { OrDivider, SocialRow } from "@/components/AuthBits";
import { Button } from "@/components/Button";
import { ScreenHeader } from "@/components/Common";
import { Input } from "@/components/Input";
import { PressableScale } from "@/components/PressableScale";
import { success, warn } from "@/lib/haptics";
import { useStore } from "@/lib/store";
import { PAD, colors, fonts } from "@/lib/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const titleCase = (s: string) =>
  s.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function SignIn() {
  const router = useRouter();
  const signIn = useStore((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [tried, setTried] = useState(false);
  const [loading, setLoading] = useState(false);

  const enter = (name: string, mail: string) => {
    signIn(name, mail);
    success();
    const s = useStore.getState();
    router.replace(s.onboarded ? "/(tabs)" : "/greeting");
  };

  const submit = () => {
    setTried(true);
    if (!EMAIL.test(email.trim()) || pw.length < 6) {
      warn();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      enter(titleCase(email.trim().split("@")[0]), email.trim());
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenHeader />
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* <Animated.Text entering={FadeInDown.delay(60).springify()} style={styles.title}> */}
        <Animated.Text
          entering={FadeInDown.delay(30).duration(220)}
          style={styles.title}
        >
          Welcome back
        </Animated.Text>
        {/* <Animated.Text entering={FadeInDown.delay(120).springify()} style={styles.sub}> */}
        <Animated.Text
          entering={FadeInDown.delay(70).duration(220)}
          style={styles.sub}
        >
          Sign in to pick up where you left off.
        </Animated.Text>
        {/* <Animated.View entering={FadeInDown.delay(180).springify()}> */}
        <Animated.View entering={FadeInDown.delay(110).duration(220)}>
          <SocialRow
            onPress={() => enter("Zipp Member", "member@zipprepublic.test")}
          />
          <OrDivider />
          <Input
            label="Email address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={
              tried && !EMAIL.test(email.trim())
                ? "Enter a valid email address"
                : null
            }
          />
          <Input
            label="Password"
            placeholder="Your password"
            value={pw}
            onChangeText={setPw}
            password
            error={tried && pw.length < 6 ? "Password is too short" : null}
          />
          <PressableScale
            onPress={() => router.push("/forgot")}
            style={{ alignSelf: "flex-end", marginBottom: 6 }}
          >
            <Text style={styles.forgot}>Forgot password?</Text>
          </PressableScale>
          <Button
            title="Sign in"
            onPress={submit}
            loading={loading}
            style={{ marginTop: 12 }}
          />
        </Animated.View>
        <PressableScale
          onPress={() => router.replace("/signup")}
          style={{ alignSelf: "center", marginTop: 22 }}
        >
          <Text style={styles.foot}>
            New to Zipp Republic?{" "}
            <Text style={styles.bold}>Create an account</Text>
          </Text>
        </PressableScale>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: PAD, paddingBottom: 40 },
  title: {
    fontFamily: fonts.black,
    fontSize: 30,
    color: colors.ink,
    textAlign: "center",
    marginTop: 4,
  },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.mute,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  forgot: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
    textDecorationLine: "underline",
  },
  foot: { fontFamily: fonts.medium, fontSize: 14, color: colors.body },
  bold: { fontFamily: fonts.heavy, color: colors.ink },
});
