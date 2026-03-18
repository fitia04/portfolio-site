import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { stats, audience, services, creatorInfo, partnerLogos } from "../media-kit/data";

const colors = {
  primary: "#4A7C59",
  secondary: "#B5976B",
  bg: "#F7F4EF",
  text: "#1E2D24",
  textLight: "#5C6B5C",
  accent: "#DDD5C0",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: colors.white,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: `2px solid ${colors.accent}`,
  },
  headerText: {
    marginLeft: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  tagline: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 12,
    marginTop: 24,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 10,
  },
  statCard: {
    width: "48%",
    padding: 16,
    backgroundColor: colors.bg,
    borderRadius: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 4,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  barLabel: {
    width: 80,
    fontSize: 10,
    color: colors.text,
  },
  barBg: {
    flex: 1,
    height: 10,
    backgroundColor: colors.accent,
    borderRadius: 5,
  },
  barFill: {
    height: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  barValue: {
    width: 35,
    fontSize: 10,
    color: colors.textLight,
    textAlign: "right",
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  serviceCard: {
    width: "48%",
    padding: 12,
    backgroundColor: colors.bg,
    borderRadius: 8,
  },
  serviceTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 9,
    color: colors.textLight,
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: `1px solid ${colors.accent}`,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: colors.textLight,
  },
  logosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    alignItems: "center",
  },
  logoText: {
    fontSize: 10,
    color: colors.textLight,
    padding: 8,
    backgroundColor: colors.bg,
    borderRadius: 6,
  },
});

function formatStatValue(value: number, suffix: string): string {
  const formatted = value % 1 !== 0 ? value.toFixed(1) : value.toLocaleString("fr-FR");
  return formatted + suffix;
}

export default function MediaKitPDF() {
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      {/* Page 1: Stats + Audience */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.name}>{creatorInfo.name}</Text>
            <Text style={styles.tagline}>{creatorInfo.tagline}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{"Chiffres clés"}</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{formatStatValue(stat.value, stat.suffix)}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Audience</Text>
        <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.text, marginBottom: 8 }}>
          {"Tranches d'âge"}
        </Text>
        {audience.ageRanges.map((range) => (
          <View key={range.label} style={styles.barRow}>
            <Text style={styles.barLabel}>{range.label} ans</Text>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${range.percentage}%` }]} />
            </View>
            <Text style={styles.barValue}>{range.percentage}%</Text>
          </View>
        ))}

        <View style={{ flexDirection: "row", gap: 20, marginTop: 12, marginBottom: 8 }}>
          <Text style={{ fontSize: 10, color: colors.text }}>
            {"Femmes : " + audience.gender.female + "%"}
          </Text>
          <Text style={{ fontSize: 10, color: colors.text }}>
            {"Hommes : " + audience.gender.male + "%"}
          </Text>
        </View>

        <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.text, marginBottom: 8, marginTop: 8 }}>
          Top pays
        </Text>
        {audience.topCountries.map((country) => (
          <View key={country.country} style={styles.barRow}>
            <Text style={styles.barLabel}>{country.flag} {country.country}</Text>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${country.percentage}%`, backgroundColor: colors.secondary }]} />
            </View>
            <Text style={styles.barValue}>{country.percentage}%</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>{"Media Kit — " + creatorInfo.name}</Text>
          <Text style={styles.footerText}>{"Données à jour au " + today}</Text>
        </View>
      </Page>

      {/* Page 2: Services + Collaborations */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Collaborations</Text>
        <View style={styles.logosGrid}>
          {partnerLogos.map((logo) => (
            <Text key={logo.name} style={styles.logoText}>
              {logo.name}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{"Formats proposés"}</Text>
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <View key={service.title} style={styles.serviceCard}>
              <Text style={styles.serviceTitle}>{service.emoji} {service.title}</Text>
              <Text style={styles.serviceDesc}>{service.description}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={{ fontSize: 11, color: colors.text, marginBottom: 4 }}>
          {creatorInfo.email}
        </Text>
        <Text style={{ fontSize: 10, color: colors.textLight }}>
          {"Instagram : " + creatorInfo.instagram}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{"Media Kit — " + creatorInfo.name}</Text>
          <Text style={styles.footerText}>{"Données à jour au " + today}</Text>
        </View>
      </Page>
    </Document>
  );
}
