import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, FileText, Calendar, User, Church, Heart, Baby, Users, BookOpen, Download, Upload } from 'lucide-react';

const CarnetBaptemeApp = () => {
  const [activeTab, setActiveTab] = useState('liste');
  const [carnets, setCarnets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarnet, setSelectedCarnet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Structure des données pour un carnet complet
  const initialCarnetData = {
    // Informations de baptême
    provinceEcclesiastique: '',
    diocese: '',
    paroisse: '',
    village: '',
    numeroBapteme: '',
    numeroRegistreBapteme: '',
    dateBapteme: '',
    reverendPere: '',
    typeBapteme: 'solennel', // solennel, urgence, autre
    sousPrefecture: '',
    numeroRegistreNaissance: '',
    numeroActeNaissance: '',
    photo: '',
    nomPrenoms: '',
    dateNaissance: '',
    lieuNaissance: '',
    nomPere: '',
    originePere: '',
    nomMere: '',
    origineMere: '',
    nomParrain: '',
    nomMarraine: '',
    
    // Denier du culte (array d'objets)
    denierCulte: [],
    
    // Sacrements
    premiereCommunion: { date: '', lieu: '', paroisse: '', pretre: '' },
    confirmation: { date: '', lieu: '', paroisse: '', pretre: '' },
    professionFoi: { date: '', lieu: '', paroisse: '', pretre: '' },
    sacrementMalades: { date: '', lieu: '', paroisse: '', pretre: '' },
    
    // Confessions de carême
    confessions: [],
    
    // Mariage
    mariage: {
      numeroMariage: '',
      lieu: '',
      paroisse: '',
      nomPrenomsEpoux: '',
      dateBaptemeEpoux: '',
      numeroRegistreBaptemeEpoux: '',
      pretrePresent: '',
      premierTemoin: '',
      deuxiemeTemoin: '',
      dateBenedictionNuptiale: '',
      lieuBenedictionNuptiale: '',
      paroisseBenedictionNuptiale: '',
      dispenseNumero: '',
      eveche: '',
      dateMariageCivil: '',
      numeroMariageCivil: '',
      lieuMariageCivil: ''
    },
    
    // Enfants
    enfants: [],
    
    // Mouvements et associations
    mouvements: [],
    
    // Origines religieuses (si conversion)
    originesReligieuses: {
      dateAccueil: '',
      egliseOrigine: '',
      lieu: '',
      nomPasteurImam: ''
    }
  };
  
  const [formData, setFormData] = useState(initialCarnetData);

  // Chargement des données depuis le localStorage au démarrage
  useEffect(() => {
    const savedCarnets = JSON.parse(localStorage.getItem('carnets-bapteme') || '[]');
    setCarnets(savedCarnets);
  }, []);

  // Sauvegarde automatique
  const saveCarnets = (newCarnets) => {
    setCarnets(newCarnets);
    localStorage.setItem('carnets-bapteme', JSON.stringify(newCarnets));
  };

  // Fonctions utilitaires
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  const handleSearch = (carnets) => {
    if (!searchTerm) return carnets;
    return carnets.filter(carnet => 
      carnet.nomPrenoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carnet.numeroBapteme?.includes(searchTerm) ||
      carnet.paroisse?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const openModal = (type, carnet = null) => {
    setModalType(type);
    if (carnet) {
      setSelectedCarnet(carnet);
      setFormData(carnet);
    } else {
      setSelectedCarnet(null);
      setFormData({ ...initialCarnetData, id: generateId() });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCarnet(null);
    setFormData(initialCarnetData);
  };

  const handleSave = () => {
    const newCarnets = selectedCarnet 
      ? carnets.map(c => c.id === selectedCarnet.id ? formData : c)
      : [...carnets, formData];
    
    saveCarnets(newCarnets);
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce carnet ?')) {
      const newCarnets = carnets.filter(c => c.id !== id);
      saveCarnets(newCarnets);
    }
  };

  // Fonction pour ajouter un paiement de denier du culte
  const ajouterDenierCulte = () => {
    const nouveauPaiement = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      montant: '',
      recu: '',
      pretreSignature: '',
      dateSignature: ''
    };
    setFormData({
      ...formData,
      denierCulte: [...formData.denierCulte, nouveauPaiement]
    });
  };

  // Fonction pour ajouter une confession
  const ajouterConfession = () => {
    const nouvelleConfession = {
      id: generateId(),
      annee: new Date().getFullYear(),
      date: new Date().toISOString().split('T')[0],
      pretre: '',
      paroisse: ''
    };
    setFormData({
      ...formData,
      confessions: [...formData.confessions, nouvelleConfession]
    });
  };

  // Fonction pour ajouter un enfant
  const ajouterEnfant = () => {
    const nouvelEnfant = {
      id: generateId(),
      nomPrenoms: '',
      dateNaissance: '',
      lieuNaissance: '',
      dateBapteme: '',
      lieuBapteme: '',
      paroisseBapteme: '',
      numeroRegistreBapteme: '',
      dateConfirmation: '',
      lieuConfirmation: ''
    };
    setFormData({
      ...formData,
      enfants: [...formData.enfants, nouvelEnfant]
    });
  };

  // Fonction pour ajouter un mouvement
  const ajouterMouvement = () => {
    const nouveauMouvement = {
      id: generateId(),
      designation: '',
      dateInscription: '',
      paroisse: '',
      lieu: '',
      titreResponsabilite: ''
    };
    setFormData({
      ...formData,
      mouvements: [...formData.mouvements, nouveauMouvement]
    });
  };

  const filteredCarnets = handleSearch(carnets);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Church className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Carnets de Baptême</h1>
                <p className="text-sm text-gray-600">Gestion digitale - Église Catholique de Côte d'Ivoire</p>
              </div>
            </div>
            <button
              onClick={() => openModal('nouveau')}
              className="bg-blue-600 hover:bg-blue-1000 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Nouveau Carnet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow-md p-1">
          <nav className="flex space-x-1">
            {[
              { id: 'liste', label: 'Liste des Carnets', icon: FileText },
              { id: 'sacrements', label: 'Les Sacrements', icon: FileText },
              { id: 'mouvements', label: 'Mouvements', icon: FileText },
              { id: 'enfants', label: 'Liste des Enfants', icon: FileText },
              { id: 'recherche', label: 'Recherche Avancée', icon: Search },
              { id: 'statistiques', label: 'Statistiques', icon: BookOpen }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === id 
                    ? 'bg-blue-100 text-blue-700 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-12">
        {activeTab === 'liste' && (
          <div className="space-y-6">
            {/* Barre de recherche */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, numéro de baptême ou paroisse..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Liste des carnets */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Carnets de Baptême ({filteredCarnets.length})
                </h2>
              </div>
              
              {filteredCarnets.length === 0 ? (
                <div className="p-12 text-center">
                  <Church className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun carnet trouvé</h3>
                  <p className="text-gray-600">
                    {carnets.length === 0 
                      ? 'Commencez par créer votre premier carnet de baptême'
                      : 'Aucun carnet ne correspond à votre recherche'
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredCarnets.map((carnet) => (
                    <div key={carnet.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {carnet.nomPrenoms || 'Nom non renseigné'}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span>N° {carnet.numeroBapteme || 'N/A'}</span>
                                <span>•</span>
                                <span>{carnet.paroisse || 'Paroisse non renseignée'}</span>
                                <span>•</span>
                                <span>{carnet.dateBapteme || 'Date non renseignée'}</span>
                              </div>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  carnet.denierCulte?.length > 0 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  Denier: {carnet.denierCulte?.length || 0} paiements
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  carnet.confessions?.length > 0 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  Confessions: {carnet.confessions?.length || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openModal('consulter', carnet)}
                            className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openModal('modifier', carnet)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(carnet.id)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'statistiques' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Carnets</p>
                  <p className="text-3xl font-bold text-blue-600">{carnets.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paiements Denier</p>
                  <p className="text-3xl font-bold text-green-600">
                    {carnets.reduce((total, carnet) => total + (carnet.denierCulte?.length || 0), 0)}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mariages</p>
                  <p className="text-3xl font-bold text-pink-600">
                    {carnets.filter(carnet => carnet.mariage?.numeroMariage).length}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Enfants</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {carnets.reduce((total, carnet) => total + (carnet.enfants?.length || 0), 0)}
                  </p>
                </div>
                <Baby className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalType === 'nouveau' ? 'Nouveau Carnet de Baptême' : 
                 modalType === 'modifier' ? 'Modifier le Carnet' : 
                 'Consulter le Carnet'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                X
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[70vh] p-6">
              {/* Formulaire de saisie complet */}
              <div className="space-y-8">
                {/* Section Baptême */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <Church className="h-5 w-5 mr-2" />
                    Informations de Baptême
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Province Ecclésiastique"
                      value={formData.provinceEcclesiastique}
                      onChange={(e) => setFormData({...formData, provinceEcclesiastique: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={modalType === 'consulter'}
                    />
                    <input
                      type="text"
                      placeholder="Diocèse"
                      value={formData.diocese}
                      onChange={(e) => setFormData({...formData, diocese: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={modalType === 'consulter'}
                    />
                    <input
                      type="text"
                      placeholder="Paroisse"
                      value={formData.paroisse}
                      onChange={(e) => setFormData({...formData, paroisse: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={modalType === 'consulter'}
                    />
                    <input
                      type="text"
                      placeholder="Village"
                      value={formData.village}
                      onChange={(e) => setFormData({...formData, village: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={modalType === 'consulter'}
                    />
                    <input
                      type="text"
                      placeholder="N° Baptême (N° Carnet)"
                      value={formData.numeroBapteme}
                      onChange={(e) => setFormData({...formData, numeroBapteme: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={modalType === 'consulter'}
                    />
                    <input
                      type="text"
                      placeholder="N° Registre Baptême"
                      value={formData.numeroRegistreBapteme}
                      onChange={(e) => setFormData({...formData, numeroRegistreBapteme: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={modalType === 'consulter'}
                    />
                    <input
                      type="date"
                      placeholder="Date du Baptême"
                      value={formData.dateBapteme}
                      onChange={(e) => setFormData({...formData, dateBapteme: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={modalType === 'consulter'}
                    />
                    <input
                      type="text"
                      placeholder="Nom du Révérend Père"
                      value={formData.reverendPere}
                      onChange={(e) => setFormData({...formData, reverendPere: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={modalType === 'consulter'}
                    />
                    <select
                      value={formData.typeBapteme}
                      onChange={(e) => setFormData({...formData, typeBapteme: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={modalType === 'consulter'}
                    >
                      <option value="solennel">Baptême Solennel</option>
                      <option value="urgence">Baptême d'Urgence</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                {/* Section Identité */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Identité du Baptisé
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Nom et Prénoms"
                      value={formData.nomPrenoms}
                      onChange={(e) => setFormData({...formData, nomPrenoms: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      disabled={modalType === 'consulter'}
                    />
                    <input
                      type="date"
                      placeholder="Date de Naissance"
                      value={formData.dateNaissance}
                      onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      disabled={modalType === 'consulter'}
                    />
                    <input
                      type="text"
                      placeholder="Lieu de Naissance"
                      value={formData.lieuNaissance}
                      onChange={(e) => setFormData({...formData, lieuNaissance: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      disabled={modalType === 'consulter'}
                    />
                    <input
                      type="text"
                      placeholder="Nom du Père"
                      value={formData.nomPere}
                      onChange={(e) => setFormData({...formData, nomPere: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      disabled={modalType === 'consulter'}
                    />
                    <input
                      type="text"
                      placeholder="Origine du Père"
                      value={formData.originePere}
                      onChange={(e) => setFormData({...formData, originePere: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      disabled={modalType === 'consulter'}
                    />
                    <input
                      type="text"
                      placeholder="Nom de la Mère"
                      value={formData.nomMere}
                      onChange={(e) => setFormData({...formData, nomMere: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      disabled={modalType === 'consulter'}
                    />
                    <input
                      type="text"
                      placeholder="Origine de la Mère"
                      value={formData.origineMere}
                      onChange={(e) => setFormData({...formData, origineMere: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      disabled={modalType === 'consulter'}
                    />
                    <input
                      type="text"
                      placeholder="Nom du Parrain"
                      value={formData.nomParrain}
                      onChange={(e) => setFormData({...formData, nomParrain: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      disabled={modalType === 'consulter'}
                    />
                    <input
                      type="text"
                      placeholder="Nom de la Marraine"
                      value={formData.nomMarraine}
                      onChange={(e) => setFormData({...formData, nomMarraine: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      disabled={modalType === 'consulter'}
                    />
                  </div>
                </div>

                {/* Section Denier du Culte */}
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-yellow-900 flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Denier du Culte
                    </h3>
                    {modalType !== 'consulter' && (
                      <button
                        onClick={ajouterDenierCulte}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Ajouter Paiement
                      </button>
                    )}
                  </div>
                  {formData.denierCulte?.map((paiement, index) => (
                    <div key={paiement.id} className="bg-white p-4 rounded-lg mb-3 border">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="date"
                          placeholder="Date"
                          value={paiement.date}
                          onChange={(e) => {
                            const newDenier = [...formData.denierCulte];
                            newDenier[index].date = e.target.value;
                            setFormData({...formData, denierCulte: newDenier});
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                          disabled={modalType === 'consulter'}
                        />
                        <input
                          type="text"
                          placeholder="N° Reçu"
                          value={paiement.recu}
                          onChange={(e) => {
                            const newDenier = [...formData.denierCulte];
                            newDenier[index].recu = e.target.value;
                            setFormData({...formData, denierCulte: newDenier});
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                          disabled={modalType === 'consulter'}
                        />
                        <input
                          type="text"
                          placeholder="Prêtre (Signature)"
                          value={paiement.pretreSignature}
                          onChange={(e) => {
                            const newDenier = [...formData.denierCulte];
                            newDenier[index].pretreSignature = e.target.value;
                            setFormData({...formData, denierCulte: newDenier});
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                          disabled={modalType === 'consulter'}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Autres sections */}
                {/* ... (les autres sections du formulaire) ... */}
              </div>
            </div>
            
            {modalType !== 'consulter' && (
              <div className="flex justify-end space-x-4 p-6 border-t bg-gray-50">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {modalType === 'nouveau' ? 'Créer le Carnet' : 'Sauvegarder'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarnetBaptemeApp;
