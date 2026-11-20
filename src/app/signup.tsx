import { OrDivider, SocialRow, SuccessBadge } from "@/components/AuthBits";
import { Button } from "@/components/Button";
import { ScreenHeader } from "@/components/Common";
import { Input } from "@/components/Input";
import { PressableScale } from "@/components/PressableScale";
import { Sheet } from "@/components/Sheet";
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
  Switch,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function SignUp() {
  const router = useRouter();
  const signIn = useStore((s) => s.signIn);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [agree, setAgree] = useState(false);
  const [tried, setTried] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const pop = useSharedValue(0);

  const errs = {
    name: name.trim().length < 2 ? "Enter your full name" : null,
    email: !EMAIL.test(email.trim()) ? "Enter a valid email address" : null,
    pw: pw.length < 8 ? "Use at least 8 characters" : null,
    agree: !agree ? "Please accept the terms to continue" : null,
  };

  const finish = (n: string, e: string) => {
    signIn(n, e);
    setDone(true);
    success();
    pop.value = withDelay(150, withSpring(1, { damping: 9, stiffness: 120 }));
    setTimeout(() => router.replace("/greeting"), 1900);
    pop.value = withDelay(80, withSpring(1, { damping: 18, stiffness: 280 }));
    setTimeout(() => router.replace("/greeting"), 1200);
  };

  const submit = () => {
    setTried(true);
    if (errs.name || errs.email || errs.pw || errs.agree) {
      warn();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      finish(name.trim(), email.trim());
    }, 900);
  };

  const badge = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
    opacity: pop.value,
  }));

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
        {/* <Animated.Text entering={FadeInDown.delay(60).springify()} style={styles.title}>` */}
        <Animated.Text
          entering={FadeInDown.delay(30).duration(220)}
          style={styles.title}
        >
          Create your account
        </Animated.Text>
        {/* <Animated.Text entering={FadeInDown.delay(120).springify()} style={styles.sub}>` */}
        <Animated.Text
          entering={FadeInDown.delay(70).duration(220)}
          style={styles.sub}
        >
          Join the Republic for early access to drops, restocks and members-only
          offers.
        </Animated.Text>
        {/* <Animated.View entering={FadeInDown.delay(180).springify()}>` */}
        <Animated.View entering={FadeInDown.delay(100).duration(220)}>
          <SocialRow
            onPress={() => finish("Zipp Member", "member@zipprepublic.test")}
          />
          <OrDivider />
        </Animated.View>
        {/* <Animated.View entering={FadeInDown.delay(240).springify()}>` */}
        <Animated.View entering={FadeInDown.delay(140).duration(220)}>
          <Input
            label="Full name"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            error={tried ? errs.name : null}
          />
          <Input
            label="Email address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={tried ? errs.email : null}
          />
          <Input
            label="Password"
            placeholder="At least 8 characters"
            value={pw}
            onChangeText={setPw}
            password
            error={tried ? errs.pw : null}
          />
          <View style={styles.terms}>
            <Switch
              value={agree}
              onValueChange={setAgree}
              trackColor={{ true: colors.ink, false: colors.line }}
              thumbColor="#fff"
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
            <Text style={styles.termsText}>
              I agree to the{" "}
              <Text style={styles.bold}>Terms & Privacy Policy</Text>
            </Text>
          </View>
          {tried && errs.agree ? (
            <Text style={styles.err}>{errs.agree}</Text>
          ) : null}
          <Button
            title="Sign up"
            onPress={submit}
            loading={loading}
            style={{ marginTop: 16 }}
          />
        </Animated.View>
        <PressableScale
          onPress={() => router.replace("/signin")}
          style={{ alignSelf: "center", marginTop: 22 }}
        >
          <Text style={styles.foot}>
            Already have an account? <Text style={styles.bold}>Sign in</Text>
          </Text>
        </PressableScale>
      </ScrollView>

      <Sheet visible={done} onClose={() => {}}>
        <View style={styles.sheet}>
          <Animated.View style={badge}>
            <SuccessBadge size={92} />
          </Animated.View>
          <Text style={styles.sheetTitle}>Successful!</Text>
          <Text style={styles.sheetText}>
            Your account is created and ready to go.
          </Text>
        </View>
      </Sheet>
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
    lineHeight: 20,
    color: colors.mute,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 22,
    paddingHorizontal: 12,
  },
  terms: { flexDirection: "row", alignItems: "center", marginLeft: -6 },
  termsText: { fontFamily: fonts.medium, fontSize: 13, color: colors.body },
  bold: { fontFamily: fonts.heavy, color: colors.ink },
  err: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.accent,
    marginTop: 2,
  },
  foot: { fontFamily: fonts.medium, fontSize: 14, color: colors.body },
  sheet: { alignItems: "center", paddingTop: 12, paddingBottom: 24 },
  sheetTitle: {
    fontFamily: fonts.black,
    fontSize: 24,
    color: colors.ink,
    marginTop: 18,
  },
  sheetText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.mute,
    marginTop: 6,
  },
});
