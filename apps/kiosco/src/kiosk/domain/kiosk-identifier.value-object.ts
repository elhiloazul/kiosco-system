export class KioskIdentifier {
  private constructor(readonly value: string) {}

  static generate(name: string, suffix: string): KioskIdentifier {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // elimina tildes
      .replace(/[^a-z0-9\s-]/g, '')    // elimina caracteres especiales
      .trim()
      .replace(/\s+/g, '-');           // espacios a guiones

    return new KioskIdentifier(`${slug}-${suffix}`);
  }

  static reconstitute(value: string): KioskIdentifier {
    return new KioskIdentifier(value);
  }

  toString(): string {
    return this.value;
  }
}
