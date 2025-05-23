BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [username] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [User_isActive_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Form] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [isActive] BIT NOT NULL CONSTRAINT [Form_isActive_df] DEFAULT 1,
    [beginDate] DATETIME2,
    [endDate] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Form_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [createdBy] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Form_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Field] (
    [id] NVARCHAR(1000) NOT NULL,
    [formId] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [type] NVARCHAR(1000) NOT NULL,
    [maxLength] INT,
    [minLength] INT,
    [options] TEXT NOT NULL,
    [isRequired] BIT NOT NULL CONSTRAINT [Field_isRequired_df] DEFAULT 0,
    [order] INT NOT NULL,
    [errorMessage] NVARCHAR(1000),
    CONSTRAINT [Field_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[FormResponse] (
    [id] NVARCHAR(1000) NOT NULL,
    [formId] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [FormResponse_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [FormResponse_status_df] DEFAULT 'UNREAD',
    CONSTRAINT [FormResponse_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[FieldResponse] (
    [id] NVARCHAR(1000) NOT NULL,
    [formResponseId] NVARCHAR(1000) NOT NULL,
    [fieldId] NVARCHAR(1000) NOT NULL,
    [value] TEXT NOT NULL,
    CONSTRAINT [FieldResponse_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ShopCategory] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ShopCategory_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [ShopCategory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Product] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] TEXT NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [categoryId] NVARCHAR(1000) NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [Product_isActive_df] DEFAULT 1,
    [stock] INT NOT NULL CONSTRAINT [Product_stock_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Product_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Product_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ProductImage] (
    [id] NVARCHAR(1000) NOT NULL,
    [productId] NVARCHAR(1000) NOT NULL,
    [imageUrl] NVARCHAR(1000) NOT NULL,
    [isPrimary] BIT NOT NULL CONSTRAINT [ProductImage_isPrimary_df] DEFAULT 0,
    [altText] NVARCHAR(1000),
    [displayOrder] INT NOT NULL CONSTRAINT [ProductImage_displayOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ProductImage_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ProductImage_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Form_isActive_idx] ON [dbo].[Form]([isActive]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Form_createdBy_fkey] ON [dbo].[Form]([createdBy]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Field_formId_idx] ON [dbo].[Field]([formId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [FormResponse_formId_idx] ON [dbo].[FormResponse]([formId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [FieldResponse_formResponseId_idx] ON [dbo].[FieldResponse]([formResponseId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [FieldResponse_fieldId_idx] ON [dbo].[FieldResponse]([fieldId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Product_categoryId_idx] ON [dbo].[Product]([categoryId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ProductImage_productId_idx] ON [dbo].[ProductImage]([productId]);

-- AddForeignKey
ALTER TABLE [dbo].[Form] ADD CONSTRAINT [Form_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Field] ADD CONSTRAINT [Field_formId_fkey] FOREIGN KEY ([formId]) REFERENCES [dbo].[Form]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FormResponse] ADD CONSTRAINT [FormResponse_formId_fkey] FOREIGN KEY ([formId]) REFERENCES [dbo].[Form]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FieldResponse] ADD CONSTRAINT [FieldResponse_fieldId_fkey] FOREIGN KEY ([fieldId]) REFERENCES [dbo].[Field]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[FieldResponse] ADD CONSTRAINT [FieldResponse_formResponseId_fkey] FOREIGN KEY ([formResponseId]) REFERENCES [dbo].[FormResponse]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Product] ADD CONSTRAINT [Product_categoryId_fkey] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[ShopCategory]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProductImage] ADD CONSTRAINT [ProductImage_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
