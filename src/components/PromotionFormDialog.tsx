import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePromotion, useUpdatePromotion, Promotion } from "@/hooks/usePromotions";
import { PlusCircle, Edit } from "lucide-react";

interface PromotionFormDialogProps {
  promotion?: Promotion;
  trigger?: React.ReactNode;
  isEdit?: boolean;
}

export function PromotionFormDialog({ promotion, trigger, isEdit = false }: PromotionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: promotion?.title || "",
    description: promotion?.description || "",
    discount_percentage: promotion?.discount_percentage?.toString() || "",
    discount_amount: promotion?.discount_amount?.toString() || "",
    start_date: promotion?.start_date || "",
    end_date: promotion?.end_date || "",
    promo_code: promotion?.promo_code || "",
    usage_limit: promotion?.usage_limit?.toString() || "",
    is_active: promotion?.is_active ?? true,
  });

  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const promotionData = {
        ...formData,
        discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
        discount_amount: formData.discount_amount ? parseFloat(formData.discount_amount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
      };

      if (isEdit && promotion) {
        await updatePromotion.mutateAsync({ id: promotion.id, promotionData });
      } else {
        await createPromotion.mutateAsync(promotionData);
      }
      
      setOpen(false);
      if (!isEdit) {
        setFormData({
          title: "",
          description: "",
          discount_percentage: "",
          discount_amount: "",
          start_date: "",
          end_date: "",
          promo_code: "",
          usage_limit: "",
          is_active: true,
        });
      }
    } catch (error) {
      console.error("Error submitting promotion form:", error);
    }
  };

  const defaultTrigger = isEdit ? (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Promotion
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Promotion' : 'Add New Promotion'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount_percentage">Discount %</Label>
              <Input
                id="discount_percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.discount_percentage}
                onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount_amount">Discount Amount</Label>
              <Input
                id="discount_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.discount_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, discount_amount: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="promo_code">Promo Code</Label>
            <Input
              id="promo_code"
              value={formData.promo_code}
              onChange={(e) => setFormData(prev => ({ ...prev, promo_code: e.target.value }))}
              placeholder="SAVE20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="usage_limit">Usage Limit</Label>
            <Input
              id="usage_limit"
              type="number"
              min="0"
              value={formData.usage_limit}
              onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: e.target.value }))}
              placeholder="Leave empty for unlimited"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPromotion.isPending || updatePromotion.isPending}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}