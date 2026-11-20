import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { ScreenHeader } from '@/components/Common';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { SuccessBadge } from '@/components/AuthBits';
import { PAD, colors, fonts } from '@/lib/theme';
import { success, warn } from '@/lib/haptics';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Forgot() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [tried, setTried] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = () => {
    setTried(true);
    if (!EMAIL.test(email.trim())) {
      warn();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      success();
    }, 900);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader />
      <View style={styles.body}>
        {sent ? (
          <Animated.View entering={FadeIn} style={{ alignItems: 'center', paddingTop: 40 }}>
            <Animated.View entering={ZoomIn.springify().damping(9)}>
              <SuccessBadge size={92} />
            </Animated.View>
            <Text style={styles.title}>Check your inbox</Text>
            <Text style={styles.sub}>We sent a reset link to {email.trim()}. It may take a minute to arrive.</Text>
            <Button title="Back to sign in" onPress={() => router.replace('/signin')} style={{ alignSelf: 'stretch', marginTop: 28 }} />
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.springify()}>
            <Text style={styles.title}>Forgot password?</Text>
            <Text style={styles.sub}>Enter the email linked to your account and we will send you a reset link.</Text>
            <Input label="Email address" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" error={tried && !EMAIL.test(email.trim()) ? 'Enter a valid email address' : null} />
            <Button title="Send reset link" onPress={submit} loading={loading} style={{ marginTop: 10 }} />
          </Animated.View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: PAD },
  title: { fontFamily: fonts.black, fontSize: 28, color: colors.ink, textAlign: 'center', marginTop: 8 },
  sub: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.mute, textAlign: 'center', marginTop: 8, marginBottom: 26, paddingHorizontal: 10 },
});
