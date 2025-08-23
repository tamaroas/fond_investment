"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Upload, File, X } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserClientSchema, UserClientType } from "@/schemas/userClient-schema";
import { EntrepriseSchema, EntrepriseType } from "@/schemas/entreprise-schema";
import { toast } from "@/components/ui/use-toast";
import { useUserStore } from "@/store/zustandStores";
import { useUserClient } from "@/hooks/use-userClient";
import { useEntreprise } from "@/hooks/use-entreprise";

interface CreateUserClientModdalProps {
  open: boolean;    
  setOpen: (open: boolean) => void;
  userClient: UserClientType | null;
  children?:React.ReactNode
}

interface Country {
  name: {
    common: string;
    official: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  flag: string;
  cca2: string;
}

export default function CreateUserClientModdal({open, setOpen, userClient, children}: CreateUserClientModdalProps) {
  const {createUserClientMutation, editUserClientMutation, refetch} = useUserClient();
  const {createEntrepriseMutation} = useEntreprise();
  const {user} = useUserStore();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("particulier");
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  
  // Formulaire pour particulier (existant)
  const formParticulier = useForm<UserClientType>({
    resolver: zodResolver(UserClientSchema),
    defaultValues: {
      gestionnaireId: user?.id || "",
      nom: userClient?.nom || "",
      prenom: userClient?.prenom || "",
      dateNaissance: userClient?.dateNaissance || "",
      lieuNaissance: userClient?.lieuNaissance || "",
      adresse: userClient?.adresse || "",
      email: userClient?.email || "",
      telephone: userClient?.telephone || "",
      numeroCni: userClient?.numeroCni || "",
      sexe: userClient?.sexe || "MASCULIN",
      nationalite: userClient?.nationalite || "",
    },
  });

  // Formulaire pour entreprise (nouveau)
  const formEntreprise = useForm<EntrepriseType>({
    resolver: zodResolver(EntrepriseSchema),
    defaultValues: {
      gestionnaireId: user?.id || "",
      nomLegal: "",
      raisonSociale: "",
      adresse: "",
      email: "",
      telephone: "",
      numeroPatente: "",
      numeroContribuable: "",
      numeroRegistreCommerce: "",
      numeroIdentificationFiscal: "",
      mot2passe: "",
      paysOrigine: "",
      signataire: {
        nom: "",
        prenom: "",
        telephone: "",
        mail: "",
        dateNaissance: "",
        lieuNaissance: ""
      }
    },
  });

  async function onSubmitParticulier(data: UserClientType) {
    try {
      if (userClient) {
        await editUserClientMutation.mutateAsync({
          ...data,
          id: userClient.id,
        });
      } else {
        await createUserClientMutation.mutateAsync(data);
      }
      
      // Forcer un refetch manuel après la mutation pour s'assurer que les données sont à jour
      await refetch();
      
      formParticulier.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating user client:", error);
    }
  }

  async function onSubmitEntreprise(data: EntrepriseType) {
    try {
      await createEntrepriseMutation.mutateAsync(data);
      formEntreprise.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating entreprise:", error);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier (images et PDF)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (allowedTypes.includes(file.type)) {
        setIdentityFile(file);
      } else {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez sélectionner un fichier JPG, PNG ou PDF",
          variant: "destructive",
        });
      }
    }
  };

  const removeFile = () => {
    setIdentityFile(null);
  };

  const downloadFile = () => {
    if (identityFile) {
      const url = URL.createObjectURL(identityFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = identityFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    if (userClient) {
      formParticulier.reset({
        gestionnaireId: user?.id || "",
        nom: userClient?.nom || "",
        prenom: userClient?.prenom || "",
        dateNaissance: userClient?.dateNaissance || "",
        lieuNaissance: userClient?.lieuNaissance || "",
        adresse: userClient?.adresse || "",
        email: userClient?.email || "",
        telephone: userClient?.telephone || "",
        numeroCni: userClient?.numeroCni || "",
        sexe: userClient?.sexe || "MASCULIN",
        nationalite: userClient?.nationalite || "",
      });
    }
  }, [userClient, formParticulier]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,idd,flag,cca2ttps://restcountries.com/v3.1/all?fields=name,idd,flag,cca2"
        );
        const data = await response.json();
        const validCountries = data.filter(
          (country: Country) =>
            country.idd && country.idd.root && country.idd.root !== ""
        );

        validCountries.sort((a: Country, b: Country) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(validCountries);
      } catch (error) {
        console.error("Erreur lors du chargement des pays:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="flex justify-end mb-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {
                children
            }
        
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] bg-white p-5">
          <DialogHeader>
            <DialogTitle>Nouveau client</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="particulier" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="particulier">Particulier</TabsTrigger>
              <TabsTrigger value="entreprise">Entreprise</TabsTrigger>
            </TabsList>
            
            {/* Formulaire Particulier */}
            <TabsContent value="particulier">
              <Form {...formParticulier}>
                <form onSubmit={formParticulier.handleSubmit(onSubmitParticulier)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Informations personnelles */}
                    <FormField
                      control={formParticulier.control}
                      name="nom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formParticulier.control}
                      name="prenom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input placeholder="Prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formParticulier.control}
                      name="dateNaissance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de naissance</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formParticulier.control}
                      name="lieuNaissance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lieu de naissance</FormLabel>
                          <FormControl>
                            <Input placeholder="Lieu de naissance" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formParticulier.control}
                      name="sexe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sexe</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un sexe" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MASCULIN">Masculin</SelectItem>
                              <SelectItem value="FEMININ">Féminin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formParticulier.control}
                      name="nationalite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationalité</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner le pays d'origine" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country.cca2} value={country.name.common}>
                                    {country.name.common}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Coordonnées et identité */}
                    <FormField
                      control={formParticulier.control}
                      name="adresse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse</FormLabel>
                          <FormControl>
                            <Input placeholder="Adresse" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formParticulier.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formParticulier.control}
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+237 6XX XXX XXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formParticulier.control}
                      name="numeroCni"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro CNI/Passeport</FormLabel>
                          <FormControl>
                            <Input placeholder="Numéro de CNI/Passeport" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formParticulier.control}
                      name="gestionnaireId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Gestionnaire</FormLabel>
                          <FormControl>
                            <Input placeholder="ID du gestionnaire" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Section téléchargement pièce d'identité */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Pièce d'identité
                      </label>
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="identity-file-upload"
                        />
                        <label
                          htmlFor="identity-file-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG ou PDF (MAX. 10MB)</p>
                          </div>
                        </label>
                        
                        {identityFile && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <File className="w-5 h-5 text-blue-500 mr-2" />
                                <span className="text-sm text-blue-700 font-medium">{identityFile.name}</span>
                                <span className="text-xs text-blue-500 ml-2">
                                  ({(identityFile.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={downloadFile}
                                  className="text-blue-600 border-blue-200 hover:bg-blue-100"
                                >
                                  Télécharger
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={removeFile}
                                  className="text-red-600 border-red-200 hover:bg-red-100"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter className="mt-6">
                    <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">{userClient ? "Modifier" : "Enregistrer"}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
            
            {/* Formulaire Entreprise */}
            <TabsContent value="entreprise">
              <Form {...formEntreprise}>
                <form onSubmit={formEntreprise.handleSubmit(onSubmitEntreprise)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Informations entreprise */}
                    <FormField
                      control={formEntreprise.control}
                      name="nomLegal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom légal</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom légal" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formEntreprise.control}
                      name="raisonSociale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Raison sociale</FormLabel>
                          <FormControl>
                            <Input placeholder="Raison sociale" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formEntreprise.control}
                      name="adresse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse</FormLabel>
                          <FormControl>
                            <Input placeholder="Adresse" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formEntreprise.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formEntreprise.control}
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+237 6XX XXX XXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formEntreprise.control}
                      name="paysOrigine"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pays d'origine</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner le pays d'origine" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country.cca2} value={country.name.common}>
                                    {country.name.common}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formEntreprise.control}
                      name="numeroPatente"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro de patente</FormLabel>
                          <FormControl>
                            <Input placeholder="Numéro de patente" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formEntreprise.control}
                      name="numeroContribuable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro contribuable</FormLabel>
                          <FormControl>
                            <Input placeholder="Numéro contribuable" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formEntreprise.control}
                      name="numeroRegistreCommerce"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro RC</FormLabel>
                          <FormControl>
                            <Input placeholder="Numéro de registre de commerce" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formEntreprise.control}
                      name="numeroIdentificationFiscal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIF</FormLabel>
                          <FormControl>
                            <Input placeholder="Numéro d'identification fiscale" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formEntreprise.control}
                      name="mot2passe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Mot de passe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formEntreprise.control}
                      name="gestionnaireId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Gestionnaire</FormLabel>
                          <FormControl>
                            <Input placeholder="ID du gestionnaire" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Section Signataire */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Informations du signataire</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={formEntreprise.control}
                        name="signataire.nom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Nom du signataire" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={formEntreprise.control}
                        name="signataire.prenom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Prénom du signataire" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={formEntreprise.control}
                        name="signataire.telephone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                              <Input placeholder="+237 6XX XXX XXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={formEntreprise.control}
                        name="signataire.mail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={formEntreprise.control}
                        name="signataire.dateNaissance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date de naissance</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={formEntreprise.control}
                        name="signataire.lieuNaissance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lieu de naissance</FormLabel>
                            <FormControl>
                              <Input placeholder="Lieu de naissance" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter className="mt-6">
                    <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">Enregistrer</Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
