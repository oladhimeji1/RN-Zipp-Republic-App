import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { Chip } from './Common';
import { Input } from './Input';
import { Address } from '@/lib/store';
import { NG_STATES } from '@/lib/data';
import { colors, fonts } from '@/lib/theme';
import { warn } from '@/lib/haptics';

export function AddressForm({ defaultName = '', onSave, onCancel }: { defaultName?: string; onSave: (a: Omit<Address, 'id'>) => void; onCancel?: () => void }) {
  const [label, setLabel] = useState('Home');
  const [fullName, setFullName] = useState(defaultName);
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Lagos');
  const [tried, setTried] = useState(false);

  const errs = {
    fullName: fullName.trim().length < 2 ? 'Enter the recipient name' : null,
    phone: phone.replace(/\D/g, '').length < 10 ? 'Enter a valid phone number' : null,
    street: street.trim().length < 5 ? 'Enter a street address' : null,
    city: city.trim().length < 2 ? 'Enter a city or area' : null,
  };

  const save = () => {
    setTried(true);
    if (Object.values(errs).some(Boolean)) {
      warn();
      return;
    }
    onSave({ label, fullName: fullName.trim(), phone: phone.trim(), street: street.trim(), city: city.trim(), state });
  };

  return (
    <View>
      <Text style={styles.cap}>LABEL</Text>
      <View style={styles.chips}>
        {['Home', 'Work', 'Other'].map((l) => (
          <Chip key={l} label={l} active={label === l} onPress={() => setLabel(l)} />
        ))}
      </View>
      <View style={{ height: 16 }} />
      <Input label="Full name" value={fullName} onChangeText={setFullName} placeholder="Recipient name" autoCapitalize="words" error={tried ? errs.fullName : null} />
      <Input label="Phone number" value={phone} onChangeText={setPhone} placeholder="080 0000 0000" keyboardType="phone-pad" error={tried ? errs.phone : null} />
      <Input label="Street address" value={street} onChangeText={setStreet} placeholder="House number and street" error={tried ? errs.street : null} />
      <Input label="City / area" value={city} onChangeText={setCity} placeholder="e.g. Ikeja" error={tried ? errs.city : null} />
      <Text style={styles.cap}>STATE</Text>
      <View style={styles.chips}>
        {NG_STATES.map((s) => (
          <Chip key={s} label={s} active={state === s} onPress={() => setState(s)} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 22 }}>
        {onCancel ? <Button title="Cancel" variant="outline" onPress={onCancel} style={{ flex: 1 }} /> : null}
        <Button title="Save address" onPress={save} style={{ flex: 1.4 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cap: { fontFamily: fonts.heavy, fontSize: 11, letterSpacing: 2, color: colors.mute, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
