import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useStore from "@/context/store";

const withAdminAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthenticatedComponent = (props: P) => {
    const { currentUser } = useStore();
    const router = useRouter();

    useEffect(() => {
      // Si l'utilisateur n'est pas connecté, redirigez vers la page de connexion
      if (!currentUser || currentUser && !(currentUser.role === "admin")) {
        router.push("/connexion");
      }
    }, [currentUser, router]);

    // Affiche un écran de chargement ou null si non autorisé
    if (!currentUser || currentUser && !(currentUser.role === "admin")) {
      return <p>Chargement...</p>;
    }

    // Passe toutes les props au composant encapsulé
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAdminAuth;
