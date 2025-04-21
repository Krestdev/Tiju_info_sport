// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import useStore from "@/context/store";

// const withAdminAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
//   const AuthenticatedComponent = (props: P) => {
//     const { currentUser } = useStore();
//     const router = useRouter();

//     useEffect(() => {
//       // Si l'utilisateur n'est pas connecté, redirigez vers la page de connexion
//       if (!currentUser || currentUser && !(currentUser.role === "admin")) {
//         router.push("/connexion");
//       }
//     }, [currentUser, router]);

//     // Affiche un écran de chargement ou null si non autorisé
//     if (!currentUser || currentUser && !(currentUser.role === "admin")) {
//       return <p>Chargement...</p>;
//     }

//     // Passe toutes les props au composant encapsulé
//     return <WrappedComponent {...props} />;
//   };

//   return AuthenticatedComponent;
// };

// export default withAdminAuth;


import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useStore from "@/context/store";

const withRoleAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: "super-admin" | "admin" | "editor"
) => {
  const AuthenticatedComponent = (props: P) => {
    const { currentUser } = useStore();
    const router = useRouter();

    useEffect(() => {
      if (!currentUser) {
        // Si l'utilisateur n'est pas connecté, redirige vers la page de connexion
        router.push("/connexion");
        return;
      }

      // Vérification des accès en fonction du rôle
      const hasAccess = checkAccess(currentUser.role, requiredRole);
      
      if (!hasAccess) {
        // Redirige vers une page "non autorisé" ou la page d'accueil
        router.push("/dashboard/articles");
      }
    }, [currentUser, router]);

    if (!currentUser) {
      return <p>Chargement...</p>;
    }

    // Vérifie à nouveau l'accès au cas où le rendu se fait avant l'effet
    const hasAccess = checkAccess(currentUser.role, requiredRole);
    if (!hasAccess) {
      return <h3>Chargement...</h3>;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

// Fonction utilitaire pour vérifier les accès
function checkAccess(
  userRole: string,
  requiredRole?: "super-admin" | "admin" | "editor"
): boolean {
  // Si aucun rôle requis n'est spécifié, tout le monde y a accès
  if (!requiredRole) return true;

  // Les super-admin ont accès à tout
  if (userRole === "super-admin") return true;

  // Les admin ont accès à tout sauf si la page est réservée aux super-admin
  if (userRole === "admin" && requiredRole !== "super-admin") return true;

  // Les editors n'ont accès qu'aux pages articles
  if (userRole === "editor" && requiredRole === "editor") return true;

  return false;
}

export default withRoleAuth;