// STOCKAGE LOCAL ICI

import AsyncStorage from '@react-native-async-storage/async-storage';

//Types de données

export interface User {
  id: string;
  pseudo: string;
  password: string;
  sexe?: 'F' | 'H' | 'A';
  age?: number;
  taille_cm?: number;
  poids_kg?: number;
  profilePhoto?: string;
  dateCreation: string;
  sessions: SportSession[];
  donnees: BiometricData[];
}

export interface ConnectionSession {
  code: string;                // Code de connexion à 6 chiffres
  createdAt: string;           // Quand le code a été généré
  lastActivity: string;        // Dernière activité (pour l'expiration)
  expiresAt: string;           // Quand le code expire
  isActive: boolean;           // Session active ou non
  isSportSessionActive: boolean; // Une session sportive est en cours
}

export interface SportSession {
  id: string;
  debut: string;
  fin?: string;
  est_active: boolean;
  sport?: 'Musculation' | 'Course' | 'Vélo';
  donnees: BiometricData[];
}

export interface BiometricData {
  id: string;
  type: 'GPS' | 'BPM' | 'Respiration' | 'Transpiration' | 'Accelerometre' | 'Temperature';
  timestamp: string;
  data: any;
}

export interface ActivityStats {
  distance_km?: number;
  temps_secondes?: number;
  allure_kmh?: number;
  fc_moyenne?: number;
  respiration_moyenne?: number;
  transpiration_moyenne?: number;
  calories?: number;
}

//Classe de gestion du stockage local
class LocalStorageService {
  
  private KEYS = {
    USERS: 'fabshirt_users',
    CURRENT_USER: 'fabshirt_current_user',
    CONNECTION_SESSION: 'fabshirt_connection_session',
  };

  // Durée de validité du code de connexion (en minutes)
  private SESSION_TIMEOUT_MINUTES = 2;

  //GÉNÉRER UN CODE À 6 CHIFFRES
  
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  //GENERER UN ID UNIQUE
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // RECUPERER TOUS LES UTILISATEURS
  private async getAllUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(this.KEYS.USERS);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.log('Erreur récupération utilisateurs:', error);
      return [];
    }
  }

  // SAUVEGARDER TOUS LES UTILISATEURS

  private async saveAllUsers(users: User[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.log('Erreur sauvegarde utilisateurs:', error);
      throw error;
    }
  }

  //INSCRIPTION
  async register(
    pseudo: string, 
    password: string, 
    userData?: {
      sexe?: 'F' | 'H' | 'A';
      age?: number;
      taille_cm?: number;
      poids_kg?: number;
    }
  ): Promise<User> {
    const users = await this.getAllUsers();
    const existingUser = users.find(u => u.pseudo.toLowerCase() === pseudo.toLowerCase());
    
    if (existingUser) {
      throw new Error('Ce pseudo est déjà utilisé');
    }

    const newUser: User = {
      id: this.generateId(),
      pseudo,
      password,
      sexe: userData?.sexe,
      age: userData?.age,
      taille_cm: userData?.taille_cm,
      poids_kg: userData?.poids_kg,
      dateCreation: new Date().toISOString(),
      sessions: [],
      donnees: [],
    };

    users.push(newUser);
    await this.saveAllUsers(users);

    console.log('Utilisateur créé:', newUser.pseudo);
    return newUser;
  }

  /**
   * CONNEXION :Vérifier identifiants
   * Génère un code de connexion à 6 chiffres
   * Valable 2 minutes (test) / 30 minutes (prod)
   */
  async login(pseudo: string, password: string): Promise<{
    user: User;
    connectionCode: string;
  }> {
    const users = await this.getAllUsers();
    const user = users.find(
      u => u.pseudo.toLowerCase() === pseudo.toLowerCase() && u.password === password
    );

    if (!user) {
      throw new Error('Pseudo ou mot de passe incorrect');
    }

    // Générer le code de connexion
    const connectionCode = this.generateCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.SESSION_TIMEOUT_MINUTES * 60000);

    const connectionSession: ConnectionSession = {
      code: connectionCode,
      createdAt: now.toISOString(),
      lastActivity: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isActive: false, // Pas encore active (l'utilisateur doit saisir le code)
      isSportSessionActive: false,
    };

    // Sauvegarder la session de connexion
    await AsyncStorage.setItem(
      this.KEYS.CONNECTION_SESSION,
      JSON.stringify(connectionSession)
    );

    console.log('Identifiants corrects');
    console.log('CODE DE CONNEXION:', connectionCode);
    console.log('Valable jusqu\'à:', expiresAt.toLocaleString('fr-FR'));

    return { user, connectionCode };
  }

  /**
   * VÉRIFIER LE CODE DE CONNEXION - ÉTAPE 2
   * L'utilisateur saisit le code → Accès à l'app
   */
  async verifyConnectionCode(enteredCode: string, user: User): Promise<boolean> {
    const sessionJson = await AsyncStorage.getItem(this.KEYS.CONNECTION_SESSION);
    
    if (!sessionJson) {
      throw new Error('Aucune session de connexion en attente');
    }

    const session: ConnectionSession = JSON.parse(sessionJson);

    // Vérifier le code
    if (enteredCode !== session.code) {
      console.log('Code incorrect');
      return false;
    }

    // Vérifier que le code n'a pas expiré
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);

    if (now > expiresAt) {
      console.log('Code expiré');
      return false;
    }

    // Code correct ! Activer la session
    session.isActive = true;
    session.lastActivity = now.toISOString();

    await AsyncStorage.setItem(
      this.KEYS.CONNECTION_SESSION,
      JSON.stringify(session)
    );

    // Sauvegarder l'utilisateur connecté
    await AsyncStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));

    console.log('Code validé - Session activée');
    console.log('Utilisateur connecté:', user.pseudo);

    return true;
  }

  /**
   * VÉRIFIER SI LA SESSION DE CONNEXION EST VALIDE
   * 
   * À appeler régulièrement pour vérifier l'expiration
   * Retourne true si la session est encore valide
   */
  async isConnectionSessionValid(): Promise<{
    isValid: boolean;
    needsReauth: boolean;
    currentCode?: string;
  }> {
    try {
      const sessionJson = await AsyncStorage.getItem(this.KEYS.CONNECTION_SESSION);
      
      if (!sessionJson) {
        return { isValid: false, needsReauth: true };
      }

      const session: ConnectionSession = JSON.parse(sessionJson);

      if (!session.isActive) {
        return { isValid: false, needsReauth: true };
      }

      const now = new Date();
      const lastActivity = new Date(session.lastActivity);
      const expiresAt = new Date(session.expiresAt);

      // Calculer le temps d'inactivité
      const inactivityMinutes = (now.getTime() - lastActivity.getTime()) / 60000;

      // Si une session sportive est active → NE PAS expirer
      if (session.isSportSessionActive) {
        console.log('Session sportive en cours - Code toujours valide');
        return { isValid: true, needsReauth: false, currentCode: session.code };
      }

      // Si inactivité > timeout → Session expirée
      if (inactivityMinutes >= this.SESSION_TIMEOUT_MINUTES || now > expiresAt) {
        console.log('Session expirée - Inactivité > ' + this.SESSION_TIMEOUT_MINUTES + ' min');
        session.isActive = false;
        await AsyncStorage.setItem(
          this.KEYS.CONNECTION_SESSION,
          JSON.stringify(session)
        );
        return { isValid: false, needsReauth: true, currentCode: session.code };
      }

      // Session toujours valide
      return { isValid: true, needsReauth: false, currentCode: session.code };
    } catch (error) {
      console.log('Erreur vérification session:', error);
      return { isValid: false, needsReauth: true };
    }
  }

  /**
   * METTRE À JOUR L'ACTIVITÉ
   * 
   * À appeler lors de chaque action de l'utilisateur
   * pour prolonger la session
   */
  async updateActivity(): Promise<void> {
    try {
      const sessionJson = await AsyncStorage.getItem(this.KEYS.CONNECTION_SESSION);
      
      if (!sessionJson) return;

      const session: ConnectionSession = JSON.parse(sessionJson);
      session.lastActivity = new Date().toISOString();

      await AsyncStorage.setItem(
        this.KEYS.CONNECTION_SESSION,
        JSON.stringify(session)
      );
    } catch (error) {
      console.log('Erreur mise à jour activité:', error);
    }
  }

  ///DÉCONNEXION
  async logout(): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      if (user) {
        // Fermer toutes les sessions sportives
        user.sessions.forEach(s => {
          if (s.est_active) {
            s.est_active = false;
            s.fin = new Date().toISOString();
          }
        });
        await this.updateCurrentUser(user);
      }

      await AsyncStorage.multiRemove([
        this.KEYS.CURRENT_USER,
        this.KEYS.CONNECTION_SESSION,
      ]);

      console.log('Déconnexion réussie');
    } catch (error) {
      console.log('Erreur déconnexion:', error);
    }
  }

  /// RÉCUPÉRER L'UTILISATEUR CONNECTÉ
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(this.KEYS.CURRENT_USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.log('Erreur récupération utilisateur courant:', error);
      return null;
    }
  }

  // SUPPRIMER LE COMPTE DE L'UTILISATEUR CONNECTÉ
  async deleteAccount(): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Utilisateur non connecté');

    // Retirer l'utilisateur de la liste globale
    const users = await this.getAllUsers();
    const filtered = users.filter(u => u.id !== user.id);
    await this.saveAllUsers(filtered);

    // Effacer la session et l'utilisateur courant
    await AsyncStorage.multiRemove([
      this.KEYS.CURRENT_USER,
      this.KEYS.CONNECTION_SESSION,
    ]);

    console.log('Compte supprimé:', user.pseudo);
  }

  // VÉRIFIER LE MOT DE PASSE ACTUEL DE L'UTILISATEUR CONNECTÉ
  async verifyCurrentPassword(password: string): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return false;
      return user.password === password;
    } catch (error) {
      console.log('Erreur vérification mot de passe:', error);
      return false;
    }
  }

  // MODIFIER LE PSEUDO DE L'UTILISATEUR CONNECTÉ
  async updatePseudo(newPseudo: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Utilisateur non connecté');

    const users = await this.getAllUsers();
    const conflict = users.find(
      u => u.pseudo.toLowerCase() === newPseudo.toLowerCase() && u.id !== user.id
    );
    if (conflict) throw new Error('Ce pseudo est déjà utilisé');

    user.pseudo = newPseudo;
    await this.updateCurrentUser(user);
    console.log('Pseudo mis à jour:', newPseudo);
  }

  // MODIFIER LE MOT DE PASSE DE L'UTILISATEUR CONNECTÉ
  async updatePassword(newPassword: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Utilisateur non connecté');

    user.password = newPassword;
    await this.updateCurrentUser(user);
    console.log('Mot de passe mis à jour');
  }

  /**
   * VÉRIFIER LE CODE LORS DU RETOUR EN FOREGROUND
   * Ne génère pas de nouvelle session — vérifie uniquement le code existant
   * et remet à zéro le timer d'inactivité si correct
   */
  async verifyResumeCode(enteredCode: string): Promise<boolean> {
    try {
      const sessionJson = await AsyncStorage.getItem(this.KEYS.CONNECTION_SESSION);
      if (!sessionJson) return false;

      const session: ConnectionSession = JSON.parse(sessionJson);

      if (!session.isActive) return false;
      if (enteredCode !== session.code) return false;

      // Code correct — réinitialiser le timer d'inactivité sans toucher au reste
      session.lastActivity = new Date().toISOString();
      await AsyncStorage.setItem(
        this.KEYS.CONNECTION_SESSION,
        JSON.stringify(session)
      );

      console.log('Code de reprise validé - Timer réinitialisé');
      return true;
    } catch (error) {
      console.log('Erreur vérification code reprise:', error);
      return false;
    }
  }

  /// METTRE À JOUR L'UTILISATEUR COURANT
  
  private async updateCurrentUser(user: User): Promise<void> {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = user;
        await this.saveAllUsers(users);
      }
      await AsyncStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (error) {
      console.log('Erreur mise à jour utilisateur:', error);
      throw error;
    }
  }

}

export const localStorage = new LocalStorageService();