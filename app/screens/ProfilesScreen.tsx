import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, Modal, TextInput, Alert, StyleSheet } from 'react-native';
import { useSettingsStore, Profile, Sex } from '../store/settings.store';
import { Ionicons } from '@expo/vector-icons';

export default function ProfilesScreen() {
  const { profiles, currentProfileId, addProfile, updateProfile, removeProfile, setCurrentProfile } = useSettingsStore();
  const profilesArray = Object.values(profiles);

  const [isModalVisible, setModalVisible] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [profileName, setProfileName] = useState('');
  const [profileWeight, setProfileWeight] = useState('');
  const [profileAge, setProfileAge] = useState(''); // New state for age in years
  const [profileAgeMonths, setProfileAgeMonths] = useState(''); // New state for age in months (for babies)
  const [profileGlassMl, setProfileGlassMl] = useState('');
  const [profileSex, setProfileSex] = useState<Sex>('male'); // Default to male
  const [profileIsPregnant, setProfileIsPregnant] = useState(false);
  const [profileIsLactating, setProfileIsLactating] = useState(false);

  const openAddModal = () => {
    setEditingProfile(null);
    setProfileName('');
    setProfileWeight('');
    setProfileAge(''); // Reset age in years
    setProfileAgeMonths(''); // Reset age in months
    setProfileGlassMl('250'); // Default glass size
    setProfileSex('male'); // Default to male
    setProfileIsPregnant(false);
    setProfileIsLactating(false);
    setModalVisible(true);
  };

  const openEditModal = (profile: Profile) => {
    setEditingProfile(profile);
    setProfileName(profile.name);
    setProfileWeight(profile.weightKg ? String(profile.weightKg) : '');
    // Set age: if age is less than 1, set profileAge to empty and profileAgeMonths
    if (profile.age !== null && profile.age < 1) {
      setProfileAge('');
      setProfileAgeMonths(String(Math.round(profile.age * 12)));
    } else {
      setProfileAge(profile.age ? String(profile.age) : ''); // Set age in years
      setProfileAgeMonths('');
    }
    setProfileGlassMl(String(profile.glassMl));
    setProfileSex(profile.sex);
    setProfileIsPregnant(profile.isPregnant);
    setProfileIsLactating(profile.isLactating);
    setModalVisible(true);
  };

  const handleSaveProfile = () => {
    if (!profileName.trim()) {
      Alert.alert('Erreur', 'Le nom du profil ne peut pas être vide.');
      return;
    }
    if (!profileSex) {
      Alert.alert('Erreur', 'Le sexe doit être spécifié.');
      return;
    }

    const weight = profileWeight ? parseFloat(profileWeight) : null;
    let age: number | null = null;

    if (profileAge.trim() !== '') {
      age = parseInt(profileAge);
      if (isNaN(age) || age < 0) {
        Alert.alert('Erreur', 'L\'âge en années doit être un nombre positif ou vide.');
        return;
      }
    }

    if (profileAgeMonths.trim() !== '') {
      const months = parseInt(profileAgeMonths);
      if (isNaN(months) || months < 0 || months > 11) {
        Alert.alert('Erreur', 'L\'âge en mois doit être un nombre entre 0 et 11.');
        return;
      }
      // If age in months is provided, convert to years (float)
      age = months / 12;
    }

    if (age === null && profileAge.trim() === '' && profileAgeMonths.trim() === '') {
      // If both age fields are empty, age remains null
    } else if (age === null && (profileAge.trim() !== '' || profileAgeMonths.trim() !== '')) {
      // This case should ideally not happen if validation above is correct, but as a safeguard
      Alert.alert('Erreur', 'Veuillez vérifier l\'âge saisi.');
      return;
    }


    const glassMl = parseFloat(profileGlassMl);

    if (isNaN(glassMl) || glassMl <= 0) {
      Alert.alert('Erreur', 'La taille du verre doit être un nombre positif.');
      return;
    }

    const profileData = {
      name: profileName.trim(),
      weightKg: weight,
      age: age, // Include age (now potentially a float for babies)
      unit: 'ml' as const, // Default to ml for new profiles
      glassMl: glassMl,
      sex: profileSex,
      isPregnant: profileIsPregnant,
      isLactating: profileIsLactating,
    };

    if (editingProfile) {
      updateProfile(editingProfile.id, profileData);
    } else {
      addProfile(profileData);
    }
    setModalVisible(false);
  };

  const handleDeleteProfile = (id: string) => {
    if (Object.keys(profiles).length === 1) {
      Alert.alert('Impossible de supprimer', 'Vous devez avoir au moins un profil.');
      return;
    }
    Alert.alert(
      'Supprimer le profil',
      'Êtes-vous sûr de vouloir supprimer ce profil ? Toutes les données d\'hydratation associées seront perdues.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => removeProfile(id) },
      ]
    );
  };

  const renderProfileItem = ({ item }: { item: Profile }) => (
    <Pressable
      onPress={() => setCurrentProfile(item.id)}
      style={[
        styles.profileItem,
        item.id === currentProfileId && styles.currentProfileItem,
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.profileName}>{item.name}</Text>
        {item.weightKg && <Text style={styles.profileDetail}>Poids: {item.weightKg} kg</Text>}
        {item.age !== null && <Text style={styles.profileDetail}>Âge: {item.age} ans</Text>}
        <Text style={styles.profileDetail}>Verre: {item.glassMl} ml</Text>
      </View>
      <Pressable onPress={() => openEditModal(item)} style={styles.editButton}>
        <Ionicons name="create-outline" size={24} color="#1EA7FD" />
      </Pressable>
      <Pressable onPress={() => handleDeleteProfile(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </Pressable>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profils</Text>

      <FlatList
        data={profilesArray}
        keyExtractor={(item) => item.id}
        renderItem={renderProfileItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun profil créé. Ajoutez-en un !</Text>}
      />

      <Pressable onPress={openAddModal} style={styles.addButton}>
        <Text style={styles.addButtonText}>Ajouter un profil</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{editingProfile ? 'Modifier le profil' : 'Ajouter un nouveau profil'}</Text>

            <TextInput
              style={styles.input}
              placeholder="Nom du profil"
              value={profileName}
              onChangeText={setProfileName}
            />
            <TextInput
              style={styles.input}
              placeholder="Poids (kg, optionnel)"
              keyboardType="numeric"
              value={profileWeight}
              onChangeText={setProfileWeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Âge (années, optionnel)"
              keyboardType="numeric"
              value={profileAge}
              onChangeText={setProfileAge}
            />
            {(profileAge === '' || parseInt(profileAge) === 0) && (
              <TextInput
                style={styles.input}
                placeholder="Âge (mois, pour les bébés < 1 an)"
                keyboardType="numeric"
                value={profileAgeMonths}
                onChangeText={setProfileAgeMonths}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Taille du verre (ml)"
              keyboardType="numeric"
              value={profileGlassMl}
              onChangeText={setProfileGlassMl}
            />

            <View style={styles.radioGroup}>
              <Text style={styles.radioLabel}>Sexe:</Text>
              <Pressable
                style={[styles.radioButton, profileSex === 'male' && styles.radioButtonSelected]}
                onPress={() => setProfileSex('male')}
              >
                <Text style={profileSex === 'male' && styles.radioButtonTextSelected}>Mâle</Text>
              </Pressable>
              <Pressable
                style={[styles.radioButton, profileSex === 'female' && styles.radioButtonSelected]}
                onPress={() => setProfileSex('female')}
              >
                <Text style={profileSex === 'female' && styles.radioButtonTextSelected}>Femelle</Text>
              </Pressable>
            </View>

            {profileSex === 'female' && (
              <>
                <View style={styles.checkboxGroup}>
                  <Pressable onPress={() => setProfileIsPregnant(!profileIsPregnant)}>
                    <Ionicons
                      name={profileIsPregnant ? 'checkbox-outline' : 'square-outline'}
                      size={24}
                      color="#1EA7FD"
                    />
                  </Pressable>
                  <Text style={styles.checkboxLabel}>Enceinte</Text>
                </View>
                <View style={styles.checkboxGroup}>
                  <Pressable onPress={() => setProfileIsLactating(!profileIsLactating)}>
                    <Ionicons
                      name={profileIsLactating ? 'checkbox-outline' : 'square-outline'}
                      size={24}
                      color="#1EA7FD"
                    />
                  </Pressable>
                  <Text style={styles.checkboxLabel}>Allaitante</Text>
                </View>
              </>
            )}

            <View style={styles.modalButtonContainer}>
              <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>Annuler</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonSave]} onPress={handleSaveProfile}>
                <Text style={styles.textStyle}>{editingProfile ? 'Sauvegarder' : 'Ajouter'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  currentProfileItem: {
    borderColor: '#1EA7FD',
    borderWidth: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  profileDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  editButton: {
    marginLeft: 10,
    padding: 5,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
  addButton: {
    backgroundColor: '#1EA7FD',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    justifyContent: 'space-around',
  },
  radioLabel: {
    fontSize: 16,
    marginRight: 10,
    fontWeight: '500',
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
  },
  radioButtonSelected: {
    backgroundColor: '#1EA7FD',
    borderColor: '#1EA7FD',
  },
  radioButtonTextSelected: {
    color: 'white',
  },
  checkboxGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#E5E7EB',
  },
  buttonSave: {
    backgroundColor: '#1EA7FD',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
