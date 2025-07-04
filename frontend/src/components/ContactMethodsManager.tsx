import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "./ui";
import { toast } from "sonner";
import {
  getContactMethods,
  updateContactMethod,
  deleteContactMethod,
  type UpdateContactMethodRequest,
} from "../api/reminders";
import { DEFAULT_USER_ID } from "../constants";
import ContactMethodCard from "./ContactMethodCard";
import ContactMethodForm from "./ContactMethodForm";

interface ContactMethodsManagerProps {
  userId?: number;
}

export default function ContactMethodsManager({
  userId = DEFAULT_USER_ID,
}: ContactMethodsManagerProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    data: contactMethods = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["contactMethods", userId],
    queryFn: () => getContactMethods(),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateContactMethodRequest;
    }) => updateContactMethod(id, data),
    onSuccess: () => {
      toast.success("Contact method updated");
      refetch();
      setEditingId(null);
    },
    onError: (error) => {
      toast.error("Failed to update contact method", {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContactMethod,
    onSuccess: () => {
      toast.success("Contact method deleted");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to delete contact method", {
        description: error.message,
      });
    },
  });

  const handleDelete = (id: number) => {
    if (
      window.confirm("Are you sure you want to delete this contact method?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading contact methods...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium">Contact Methods</h3>
        <Button
          variant="outline"
          onClick={() => setShowAddForm(true)}
          size="sm"
        >
          + Contact Method
        </Button>
      </div>

      {showAddForm && (
        <ContactMethodForm
          onCancel={() => setShowAddForm(false)}
          onSuccess={() => refetch()}
        />
      )}

      <div className="space-y-3">
        {contactMethods?.map((method) => (
          <ContactMethodCard
            key={method.id}
            method={method}
            isEditing={editingId === method.id}
            onEdit={() => setEditingId(method.id)}
            onSave={(updatedMethod) =>
              updateMutation.mutate({
                id: method.id,
                data: updatedMethod,
              })
            }
            onCancel={() => setEditingId(null)}
            onDelete={() => handleDelete(method.id)}
            isUpdating={updateMutation.isPending}
            isDeleting={deleteMutation.isPending}
          />
        ))}
      </div>

      {!contactMethods?.length && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">
            Add your first contact method to start receiving reminders.
          </p>
        </div>
      )}
    </div>
  );
}
