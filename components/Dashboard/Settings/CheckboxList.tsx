import { Checkbox } from "@/components/ui/checkbox";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface CheckboxListItem {
  id: number;
  title: string;
  footershow: boolean;
}

const CheckboxList = ({ 
  items, 
  onItemChange 
}: {
  items: CheckboxListItem[];
  onItemChange: (itemId: number, newValue: boolean) => Promise<boolean>;
}) => {
  const queryClient = useQueryClient();

  const handleSingleChange = async (itemId: number, checked: boolean) => {
    const success = await onItemChange(itemId, checked);
    
    if (success) {
      queryClient.invalidateQueries({queryKey: ['categories']});
      toast.success("Visibilité mise à jour");
    } else {
      toast.error("Échec de la mise à jour");
    }
  };

  const handleAllChange = async (checked: boolean) => {
    const results = await Promise.all(
      items.map(item => onItemChange(item.id, checked))
    );

    if (results.every(Boolean)) {
      queryClient.invalidateQueries({queryKey: ['categories']});
      toast.success("Toutes les visibilités mises à jour");
    } else {
      toast.error("Échec pour certaines mises à jour");
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-2 items-center'>
        <Checkbox
          checked={items.length > 0 && items.every(item => item.footershow)}
          onCheckedChange={(checked) => handleAllChange(!!checked)}
        />
        <span>Tout sélectionner</span>
      </div>
      
      {items.map((item) => (
        <div key={item.id} className='flex gap-2 items-center'>
          <Checkbox
            checked={item.footershow}
            onCheckedChange={(checked) => handleSingleChange(item.id, !!checked)}
          />
          {item.title}
        </div>
      ))}
    </div>
  );
};

export default CheckboxList;